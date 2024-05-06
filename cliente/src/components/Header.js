import React from "react";

import { Layout } from "antd";
const { Header: AntHeader } = Layout;

export default function Header() {
    return (
        <AntHeader style={{
            textAlign: "center",
            color: "White",
            backgroundColor: "DodgerBlue", // Cor mais escura para o header
            fontSize: 24,
        }}>
            <span
                style={{
                    fontSize: '32px', // Tamanho específico para "Smart Data"
                    fontFamily: 'Montserrat', // Fonte moderna
                    fontWeight: '700' // Peso da fonte para tornar o texto mais destacado
                }}>
                Smart Data
            </span>
        </AntHeader>
    );
}