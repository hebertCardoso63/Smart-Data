import React from "react";
import { Row, Col } from "antd";
import { Layout, Flex } from "antd";
import Header from './components/Header';
import Main from "./components/Main";

const App = () => {

    return (
        <Row>
            <Col span={24}>
                <Flex gap="middle" wrap="wrap">
                    <Layout style={layoutStyle}>
                        {/* <Header /> */}
                        <div style={{
                            padding: 'min(3vw, 48px)',
                            background: 'radial-gradient(#3894ff, #143066)'
                        }}>
                            <div
                                style={{
                                    background: '#fff',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                }}
                            >
                                <Main />
                            </div>
                        </div>
                    </Layout>
                </Flex>
            </Col>
        </Row>
    );
};

const layoutStyle = {
    overflow: "hidden",
    width: "100%",
    maxWidth: "100%",
};

export default App;