import { Button, Col, Form, Input, Modal, Row, notification } from "antd";
import React, { useState } from "react";
import { adicionarRegistroTabela } from '../services/Tables'
import { createFieldsConfig } from "../utils/formatacao"

export default function AdicionarRegistro({
    modalVisible,
    onCancel,
    dadoExemplo = {},
    tabelaNome,
}) {

    const dadosRegistro = createFieldsConfig(dadoExemplo);

    const [loading, setLoading] = useState(false);

    const handleSubmit = values => {
        const dadosRegistro = {};

        Object.keys(values).forEach(key => {
            if (values[key] !== "") {
                Object.assign(dadosRegistro, { [key]: values[key] });
            }
        });

        adicionarRegistroTabela(tabelaNome, dadosRegistro)
            .then(() => {
                notification.success({
                    message: 'Registro adicionado com sucesso!'
                });

                onCancel();
            })
            .catch(() => {

                notification.error({
                    message: 'Ocorreu um problema ao cadastrar o usuário!'
                });
            });
    }

    const requiredRule = {
        required: true,
        message: 'Campo obrigatório',
    };

    return (
        <Modal
            open={modalVisible}
            onCancel={onCancel}
            title="Adicionar registro"
            footer={null}
            destroyOnClose
        >
            <Form
                onFinish={handleSubmit}
                layout="vertical" 
            >
                <Row gutter={[24, 0]} style={{ marginTop: 24 }}>
                    {Object.keys(dadosRegistro).map((fieldKey) => (
                        <Col span={24} key={fieldKey}>
                            <Form.Item
                                name={fieldKey}
                                label={dadosRegistro[fieldKey].label}
                                initialValue={dadosRegistro[fieldKey].initialValue || ""}
                                rules={[requiredRule]}
                            >
                                <Input
                                    type={"text"}
                                    placeholder={`Digite ${dadosRegistro[fieldKey].label}`}
                                />
                            </Form.Item>
                        </Col>
                    ))}
                    <Col style={{ marginLeft: 'auto' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Adicionar registro
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}