import React, { useEffect } from 'react';
import { Modal, Form, Row, Col, Input } from 'antd';

export function EditarRegistro({
    currentRecord,
    editModalVisible,
    onCancel,
    onUpdate, // Função para atualizar os dados na tabela principal
}) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(currentRecord); // Pré-carrega o formulário com os dados do registro quando a modal é aberta
    }, [currentRecord, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const updatedValues = {
                ...values,
                id: currentRecord.id,
                data_criacao: currentRecord.data_criacao,
                data_atualizacao: currentRecord.data_atualizacao,
                data_exclusao: currentRecord.data_exclusao,
            };

            onUpdate(updatedValues, currentRecord.key); // Chama a função onUpdate passando os valores atualizados e a chave do registro
            onCancel(); // Fecha a modal após a atualização
        } catch (error) {
            console.log('Erro ao validar os dados: ', error);
        }
    };

    const nonEditableFields = ['id', 'data_criacao', 'data_atualizacao', 'data_exclusao'];

    return (
        <Modal
            open={editModalVisible}
            onCancel={onCancel}
            onOk={handleSubmit}
            title="Editar Registro"
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Row>
                {Object.keys(currentRecord)
                        .filter(fieldKey => !nonEditableFields.includes(fieldKey)) // Filtra os campos não editáveis
                        .map((fieldKey) => (
                            <Col span={24} key={fieldKey}>
                                <Form.Item
                                    name={fieldKey}
                                    label={fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} // Formata o label
                                    initialValue={currentRecord[fieldKey]}
                                >
                                    <Input
                                        type={"text"}
                                        placeholder={`Digite ${fieldKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`} // Placeholder formatado
                                    />
                                </Form.Item>
                            </Col>
                        ))}
                </Row>
            </Form>
        </Modal>
    );
}

export default EditarRegistro;
