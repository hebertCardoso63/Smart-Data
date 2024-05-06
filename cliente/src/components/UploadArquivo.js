import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Row, Col } from 'antd';
const { Dragger } = Upload;

const props = {
    multiple: false,
    action: 'http://localhost:3000/upload-file',
    onChange(info) {
        const { status } = info.file;

        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }

        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};
export default function UploadArquivo() {
    return (
        <Row> 
            <Col span={24}>
                <Dragger {...props} style={{ background: 'GhostWhite'}}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p style={{ color: '#000a', fontSize: '18px', textAlign: 'center' }}>Clique para fazer o upload</p>
                    <p style={{ color: '#000a', fontSize: '18px', textAlign: 'center' }}>
                      Arquivo unico
                    </p>
                </Dragger>
            </Col>
        </Row>
        
    )
    
}