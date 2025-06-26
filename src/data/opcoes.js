export const opcoesFormulario = {
    plataforma: ['P-1', 'P-2', 'P-3', 'P-4'],
    modulo: ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10'],
    setor: ['S01', 'S02', 'S03'],
    tipoEquipamento: ['Vaso de Pressão', 'Tanque', 'Permutador', 'Filtro'],
    tag: {
        'Vaso de Pressão': Array.from({ length: 50 }, (_, i) => `VP-${String(i + 1).padStart(3, '0')}`),
        'Tanque': Array.from({ length: 40 }, (_, i) => `TQ-${String(i + 1).padStart(3, '0')}`),
        'Permutador': Array.from({ length: 30 }, (_, i) => `PM-${String(i + 1).padStart(3, '0')}`),
        'Filtro': Array.from({ length: 100 }, (_, i) => `FT-${String(i + 1).padStart(3, '0')}`),
    },
    defeito: ['Redução de espessura', 'Vazamento', 'Trinca', 'Desgaste anormal', 'Outro'],
    causa: ['Corrosão externa', 'Corrosão interna', 'Vibração excessiva', 'Impacto', 'Outro'],
    categoriaRTI: ['I', 'II', 'III', 'IV'],
    recomendacao: ['Reparar imediatamente', 'Estender prazo de execução', 'Interromper o serviço', 'Pintura', 'Outra']
};