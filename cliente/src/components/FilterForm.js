import React, { useState, useEffect } from "react";
import { Form, Input, Col, Row, Button } from "antd";
import { createFilterInputsConfig } from "../utils/formatacao";

export default function FilterForm({ tableFields, onFinish }) {
  const [filterInputs, setFilterInputs] = useState({});

    const [form] = Form.useForm();

    useEffect(() => {
        if (!tableFields) return;

        setFilterInputs(createFilterInputsConfig(tableFields));
    }, [tableFields]);

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={[16, 8]}>
                {Object.keys(filterInputs).map((field) => (
                <Col span={8} key={field}>
                    <Form.Item
                        label={filterInputs[field].label}
                        name={field}
                        style={{ fontWeight: 'bold' }}
                    >
                        <Input placeholder={filterInputs[field].placeholder} />
                    </Form.Item>
                </Col>
                ))}
                <Col style={{ marginLeft: 'auto' }}>
                        <Form.Item
                            label="Ações"
                            style={{ fontWeight: 'bold' }}
                        >
                            <Button
                                onClick={() => form.resetFields()}
                                style={{ marginRight: 16 }}
                            >
                                Limpar
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                            >
                                Filtrar
                            </Button>
                        </Form.Item>
                    </Col>
            </Row>
        </Form>
    );
}
