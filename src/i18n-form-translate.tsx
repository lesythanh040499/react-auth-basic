import { AutoComplete, Col, Form, Input, Row, Select } from "antd";
import { Rule } from "antd/es/form";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import * as yup from "yup";

import DatePicker from "@app/components/atoms/DatePicker/DatePicker";
import { TextField } from "@app/components/atoms/TextField/TextField";
import { Modal } from "@app/components/molecules/Modal/Modal";
import i18n from "@app/config/i18n";
import { DATE_FORMAT } from "@app/constant/date-time";
import { isEmptyObject, normalizeText } from "@app/helpers/utils";
import { yupSync } from "@app/helpers/yupSync";
import { useGetAccountsNoPaginate, useGetCourseNoPaginate } from "@app/hooks";
import { useCreateWorkshop } from "@app/hooks/useWorkshop";
import { CourseInterface } from "@app/interfaces/Course";
import { RangePickerProps } from "antd/es/date-picker";
import { useEffect, useState } from "react";

const WorkshopCreate = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const getRequiredMessage = (field: string) =>
    i18n.t("VALIDATE.REQUIRED", {
      field: i18n.t(field),
    });

  const validator = [
    yupSync(
      yup.object().shape({
        title: yup
          .string()
          .trim()
          .required(getRequiredMessage("WORKSHOP.NAME")),
        speaker: yup.string().required(getRequiredMessage("WORKSHOP.SPEAKER")),
        date: yup.date().required(getRequiredMessage("WORKSHOP.DATE")),
      })
    ),
  ] as unknown as Rule[];

  const { mutate: handleCreateWorkshop } = useCreateWorkshop();
  const { data: dataCourses } = useGetCourseNoPaginate();
  const { data } = useGetAccountsNoPaginate();

  const [selectedSpeaker, setSelectedSpeaker] = useState<{
    id: string;
    value?: string;
    label?: string;
  } | null>(null);

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().subtract(1, "day").endOf("day");
  };

  const handleSubmit = async (value: any) => {
    const { date } = value;
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    await Promise.all([
      handleCreateWorkshop({
        ...value,
        date: formattedDate,
        speaker: selectedSpeaker?.id,
      }),
      setIsModalOpen(false),
      // form.resetFields(),
    ]);
  };

  const filterOption = (input: string, option: any) => {
    const normalizedInput = normalizeText(input);
    const normalizedLabel = option ? normalizeText(option.label) : "";
    return normalizedLabel.includes(normalizedInput);
  };
  const [errors, setErrors] = useState<any>([]);
  const [render, setRender] = useState<boolean>(false);

  const translateError = (name: string, message: string) => {
    const fieldMappings: { [key: string]: string } = {
      title: "WORKSHOP.TITLE",
      speaker: "WORKSHOP.SPEAKER",
      date: "WORKSHOP.DATE",
      courses: "WORKSHOP.COURSES",
    };

    if (fieldMappings.hasOwnProperty(name)) {
      const fieldKey = fieldMappings[name];
      return i18n.t("VALIDATE.REQUIRED", { field: i18n.t(fieldKey) });
    }

    return message;
  };

  useEffect(() => {
    if (isEmptyObject(errors)) return;

    const translateErrors = (errorObj: any) => {
      const translatedErrors = errorObj.errors.map((error: string) => {
        return translateError(errorObj.name[0], error);
      });
      return { ...errorObj, errors: translatedErrors };
    };

    const newErrors = errors.map((errorObj: any) => translateErrors(errorObj));

    setErrors(newErrors);
    setRender(true);

    const languageChangedHandler = () => {
      const newErrors = errors.map((errorObj: any) =>
        translateErrors(errorObj)
      );
      setErrors(newErrors);
    };

    i18n.on("languageChanged", languageChangedHandler);

    return () => {
      i18n.off("languageChanged", languageChangedHandler);
    };
  }, [render, i18n.language]);

  useEffect(() => {
    form.setFields(errors);
  }, [errors, form]);

  return (
    <Modal
      title={t("WORKSHOP.CREATE_WORKSHOP")}
      open={isModalOpen}
      onOk={form.submit}
      onCancel={() => {
        setIsModalOpen(false);
      }}
      width={1000}
    >
      <Form
        className="px-6 pt-6"
        onFinish={handleSubmit}
        onFinishFailed={(e) => {
          setErrors(e.errorFields);
        }}
        form={form}
        id="form-applications"
        labelAlign="left"
        wrapperCol={{ span: 24 }}
      >
        <Row gutter={[8, 8]} className="px-15px py-1rem">
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <TextField
              label={t("INPUT.NAME")}
              name="title"
              required
              rules={validator}
            >
              <Input placeholder={t("PLACEHOLDER.NAME")} allowClear />
            </TextField>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <TextField
              label={t("INPUT.SPEAKER")}
              name="speaker"
              required
              rules={validator}
            >
              <AutoComplete
                showSearch
                allowClear
                style={{ width: "100%" }}
                placeholder={t("PLACEHOLDER.SPEAKER")}
                optionFilterProp="children"
                filterOption={filterOption}
                options={data?.data?.map(
                  (data: { id: string; name: string }) => ({
                    value: data.name,
                    label: data.name,
                    id: data.id,
                    key: data.id,
                  })
                )}
                onChange={(value, option) => {
                  if (isEmptyObject(option)) {
                    setSelectedSpeaker({ id: value });
                  } else {
                    setSelectedSpeaker(
                      option as { id: string; value: string; label: string }
                    );
                  }
                }}
              />
            </TextField>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <TextField
              label={t("INPUT.DATE")}
              name="date"
              required
              rules={validator}
            >
              <DatePicker
                placeholder={t("PLACEHOLDER.DATE")}
                format={DATE_FORMAT}
                disabledDate={disabledDate}
              />
            </TextField>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <TextField
              label={t("INPUT.COURSES")}
              name="courses"
              required
              rules={[
                {
                  required: true,
                  message: t("VALIDATE.REQUIRED", {
                    field: t("WORKSHOP.COURSES"),
                  }) as string,
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder={t("PLACEHOLDER.COURSES")}
                filterOption={filterOption}
                options={dataCourses?.map((item: CourseInterface) => ({
                  value: item.id,
                  label: item.name,
                }))}
              />
            </TextField>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <TextField label={t("INPUT.DESCRIPTION")} name="description">
              <TextArea
                showCount
                maxLength={1000}
                placeholder={t("PLACEHOLDER.DESCRIPTION")}
                style={{ height: 120, resize: "none", padding: "1px 5px" }}
              />
            </TextField>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default WorkshopCreate;
