/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Card, Col, Form, Input, Row, notification, Table, Tag, Space, Tabs, Image, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import AdicionarRegistro from "./AdicionarRegistro";
import EditarRegistro from "./EditarRegistro";
import UploadArquivo from "./UploadArquivo";
import { createColumnsConfig } from "../utils/formatacao";

import imagem from '../img/background.jpg';
import { downloadFile } from '../services/Files'
import { obterDadosTabela, editarRegistroTabela, obterTodasTabelas, obterAlteracaoesTabela } from '../services/Tables'
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import FilterForm from "./FilterForm";
const { TabPane } = Tabs;

export default function Main() {
    const [form] = Form.useForm();

    const [dados, setDados] = useState([]);
    const [dadosHistoricos, setDadosHistoricos] = useState([]);
    const [columnsHistoricos, setColumnsHistoricos] = useState([]);
    const [tabelas, setTabelas] = useState([]);
    const [columns, setColumns] = useState([]);
    const [currentTabKey, setCurrentTabKey] = useState('1');
    const [currentTableName, setCurrentTableName] = useState('');

    const [loading, setLoading] = useState(false);


    // Estado Modal
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({});

    const fetchData = async (tableName, filter) => {
        setLoading(true);
        try {
            const { data: resultado } = await obterDadosTabela(tableName, filter);
            console.log(8888, resultado)
            if (resultado.data && resultado.data.length) {
                setDados(resultado.data);
                setColumns(createColumnsConfig(Object.keys(resultado.data[0])));

                console.log(9999, dados);
            } else {
                setDados([]);
                setColumns([]);
            }
            
        } catch (error) {
            console.error('Erro ao buscar dados da tabela:', error);
            notification.error({
                message: 'Erro ao buscar dados',
                description: 'Não foi possível obter dados da tabela.',
            });
            setDados([]);
            setColumns([]);
        }

        setLoading(false);
    };


    const onUpdate = async updatedValues => {
        try {
            await editarRegistroTabela(currentTableName, updatedValues);

            notification.success({
                message: 'Registro editado com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao atualizar:', error);

            notification.error({
                message: 'Houve um problema ao atualizar o registro',
                description: 'Tente novamente em alguns segundos',
            });
        }
    };

    const initializeData = async () => {
        try {
            const fetchedTabelas = await obterTodasTabelas();
            if (fetchedTabelas.length > 0) {
                const firstTableName = fetchedTabelas[0].table_name;
                
                await fetchData(firstTableName);

                setTabelas(fetchedTabelas);
                setCurrentTableName(firstTableName);
                setCurrentTabKey('1'); // Supondo que o primeiro item sempre será a primeira aba

            } else {
                setTabelas([]);
                setCurrentTableName('');
                setCurrentTabKey('1');

            }
        } catch (error) {
            console.error('Erro ao inicializar dados:', error);
            notification.error({
                message: 'Erro ao carregar dados iniciais',
                description: 'Não foi possível obter dados da API inicial.',
            });
        }
    };

    useEffect(() => {
        initializeData();
    }, []);

    useEffect(() => {
        const updateColumns = async () => {
            if (currentTableName) {
                // Simulação de uma chamada de API ou seleção de estrutura de dados
                const { data: dadosTabela } = await obterDadosTabela(currentTableName);  // Função hipotética para obter campos

                const historicoTabela = await obterAlteracaoesTabela(currentTableName);


                if (historicoTabela.length) {
                    setDadosHistoricos(historicoTabela);

                    const colunasHistoricosFormatadas = createColumnsConfig(Object.keys(historicoTabela[0]));
                    
                    colunasHistoricosFormatadas.push(
                        {
                            title: 'Tipo de Alteração',
                            dataIndex: 'tipo_alteracao',
                            key: 'tipo_alteracao',
                            render: texto => (
                                <Tag color={texto === 'ADICAO' ? 'green' : texto === 'EDICAO' ? 'purple' : 'default'}>
                                    {texto}
                                </Tag>
                            ),
                        },
                    )
                    setColumnsHistoricos(colunasHistoricosFormatadas)
                } else {
                    setDadosHistoricos([])
                    setColumnsHistoricos([])
                }

                const tableFields = Object.keys(dadosTabela[0])

                const colunasFormatas = createColumnsConfig(tableFields);

                // Adicionando a coluna de Ações que sempre existe
                colunasFormatas.push({
                    title: 'Ações',
                    key: 'acoes',
                    fixed: 'right',
                    render: (_, record) => (
                        <Space size="middle">
                            <a onClick={() => {
                                setCurrentRecord(record);
                                setEditModalVisible(true);
                            }}>Editar</a>
                        </Space>
                    ),
                });

                setColumns(colunasFormatas);
                setDados(dadosTabela);
            }
        }

        updateColumns();

    }, [currentTableName]);

    // Função onClick para o botão Exportar
    const handleExport = async () => {
        try {
            // Supondo que 'filtro' seja um objeto com os filtros aplicados atualmente, se houver
            const filtro = { /* definição do objeto de filtro, dependendo do que você precisa */ };

            await downloadFile(currentTableName, filtro);
            notification.success({
                message: 'Download iniciado',
                description: 'O arquivo está sendo baixado.'
            });
        } catch (error) {
            console.error('Erro ao baixar o arquivo:', error);
            notification.error({
                message: 'Erro no download',
                description: 'Não foi possível baixar o arquivo. Por favor, tente novamente.'
            });
        }
    }

    const handleTabChange = (key) => {
        const tableName = tabelas[parseInt(key) - 1].table_name;
        setCurrentTabKey(key);
        setCurrentTableName(tableName);
        fetchData(tableName);
    };

    const [modalVisible, setModalVisible] = useState(false);

    const handleSubmit = async values => {
        console.log(13, Object.keys(values));

        const filteredValues = Object.entries(values).reduce((currFilter, [key, value]) => {
            if (!value) return currFilter;

            return {
                ...currFilter,
                [key]: value,
            };
        }, {});

        const filtro = {
            atributos_tabela: filteredValues,
            paginacao: {
                perPage: null,
                currentPage: null,
            }
        }

        console.log(888, currentTableName, filtro);
        await fetchData(currentTableName, filtro);
    }

    const renderFilter = () => (
        <Col span={24}>
            {loading ? (
                <Skeleton loading={true} />
            ) : (
                <FilterForm
                    tableFields={dados[0]}
                    onFinish={handleSubmit}
                />
            )}
        </Col>
    );

    const renderTabs = () => (
        <Tabs defaultActiveKey="1" onChange={handleTabChange}>
            {tabelas.map((tabela, index) => (
                <TabPane tab={tabela.table_name} key={String(index + 1)}>
                    <Row gutter={[24, 24]}>
                        {renderFilter()}
                        <Col span={24} lg={24}>
                            <Table
                                span={24}
                                lg={24}
                                columns={columns}
                                dataSource={dados}
                                rowKey="id"
                                scroll={{ x: 'max-content' }}
                                loading={loading}
                            />
                            <Button
                                style={{ margin: '10px auto 10px auto' }}
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={handleExport}
                            >
                                Exportar
                            </Button>
                        </Col>
                    </Row>
                </TabPane>
            ))}
        </Tabs>
    )

    const renderExtra = () => (
        <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
                setModalVisible(true);
            }}
        >
            Adicionar registro
        </Button>
    );

    const renderHero = () => (
        <Row gutter={[48, 48]} style={{ height: '70vh' }}>
            <Col span={24} md={12} lg={12}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center', 
                    height: '100%',
                    padding: '48px 0'
                }}>
                    <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 12,
                            height: '100%',
                            width: '100%',
                            padding: 20,
                            borderRadius: 15,
                            backgroundImage: `url(${imagem})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <div style={{ fontSize: 42, fontWeight: 'bold', color: 'ghostwhite' }}>SMART DATA</div>
                        <div style={{ fontSize: 28, color: 'ghostwhite' }}>Facilitando a edição do seu CSV!</div>
                    </div>
                </div>
            </Col>
            <Col span={24} md={12} lg={12}>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center', // Centraliza horizontalmente
                    alignItems: 'center',     // Centraliza verticalmente (se necessário)
                    height: '100%',
                }}>
                    <div style={{
                        width: '100%',          // Ajusta para 50% da largura do container
                        maxWidth: '750px'      // Limita a largura máxima para não ficar muito grande
                    }}>
                        <UploadArquivo />
                    </div>
                </div>
            </Col>
        </Row>
    );

    return (
        <div style={{
            width: '100%',
            minHeight: "calc(100vh)",
            color: "#000000", // Cor mais clara para o content
            backgroundColor: "#f8f8f8", // Cor de fundo mais clara para o content
            padding: 24,
        }}>
            <Row gutter={[24, 48]}>
                <Col span={24}>
                    {renderHero()}
                </Col>
                <Col span={24} lg={24}>
                    <Card title="Tabelas" extra={renderExtra()}>
                        {renderTabs()}
                    </Card>
                </Col>
                <Col span={24} lg={24}>
                    <Card title="Histórico de alterações">
                        <Row>
                            <Col span={24} lg={24}>
                                <Table
                                    span={24}
                                    lg={24}
                                    columns={columnsHistoricos}
                                    dataSource={dadosHistoricos}
                                    scroll={{ x: 'max-content' }}
                                    loading={loading}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                {!!dados.length && (
                    <AdicionarRegistro
                        modalVisible={modalVisible}
                        onCancel={() => setModalVisible(false)}
                        dadoExemplo={dados[0]}
                        tabelaNome={currentTableName}
                    />
                )}
                <EditarRegistro
                    currentRecord={currentRecord}
                    editModalVisible={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    onUpdate={onUpdate}
                />
            </Row>
        </div>
    );
}