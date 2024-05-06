export function createFieldsConfig(dataObject) {
    const fieldsConfig = {};
    const ignoredFields = ['id', 'data_criacao', 'data_atualizacao', 'data_exclusao'];

    const formatLabel = (key) => {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    Object.keys(dataObject).forEach(key => {
        if (!ignoredFields.includes(key)) { // Verifica se a chave atual não está na lista de campos ignorados
            fieldsConfig[key] = {
                label: formatLabel(key),
                placeholder: `Enter ${formatLabel(key)}`,
                rules: [{ required: true, message: `${formatLabel(key)} is required` }]
            };
        }
    });

    return fieldsConfig;
}


export function createColumnsConfig(fields) {

    const excludedFields = ['id', 'tipo_alteracao'];
    return fields
        .filter(field => !excludedFields.includes(field))
        .map(field => ({
            title: field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            dataIndex: field,
            key: field,
        }));
};

export function createFilterInputsConfig(fields) {
    const filterInputsConfig = {};
    const ignoredFields = ['id'];  // Campos a serem ignorados nos filtros

    const formatLabel = (key) => {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    Object.keys(fields).forEach(key => {
        if (!ignoredFields.includes(key)) {
            filterInputsConfig[key] = {
                label: formatLabel(key),
                placeholder: `Enter ${formatLabel(key)}`,
                name: key,
            };
        }
    });

    return filterInputsConfig;
}