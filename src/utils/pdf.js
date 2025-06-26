import {PDFDocument, rgb, StandardFonts} from 'pdf-lib';
import {addDays, parseISO, format} from 'date-fns';
import logoUrl from '../assets/logo.png'; // Importa a logo diretamente

// Utilitário para converter base64 para array de bytes
const base64ToBytes = (base64) => {
    if (!base64) return null;
    try {
        // Verifica se já é uma string base64 completa
        if (base64.includes(',')) {
            const binary = atob(base64.split(',')[1]);
            return Uint8Array.from([...binary].map((char) => char.charCodeAt(0)));
        }
        // Se não tiver vírgula, assume que é uma string base64 pura
        const binary = atob(base64);
        return Uint8Array.from([...binary].map((char) => char.charCodeAt(0)));
    } catch (error) {
        console.error('Erro ao converter base64:', error);
        return null;
    }
};

// Função auxiliar para detectar o tipo de imagem do base64
const getImageType = (base64String) => {
    if (base64String.includes('data:image/png;base64,')) {
        return 'png';
    } else if (base64String.includes('data:image/jpeg;base64,') ||
        base64String.includes('data:image/jpg;base64,')) {
        return 'jpg';
    }
    return null;
};


export async function gerarPdfInspecao(form, fotoBase64 = null) {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]); // A4 em pontos

    try {
        // Carrega e adiciona a marca d'água
        const logoResponse = await fetch(logoUrl);
        const logoArrayBuffer = await logoResponse.arrayBuffer();
        const logoImage = await doc.embedPng(logoArrayBuffer);

        // Calcula as dimensões da marca d'água (50% do tamanho da página)
        const pageDims = page.getSize();
        const logoWidth = pageDims.width * 0.5;
        const logoScale = logoWidth / logoImage.width;
        const logoHeight = logoImage.height * logoScale;

        // Desenha a marca d'água no centro da página com transparência
        page.drawImage(logoImage, {
            x: (pageDims.width - logoWidth) / 2,
            y: (pageDims.height - logoHeight) / 2,
            width: logoWidth,
            height: logoHeight,
            opacity: 0.3
        });
    } catch (error) {
        console.error('Erro ao adicionar marca d\'água:', error);
        // Continua gerando o PDF mesmo se houver erro na marca d'água
    }

    const {width, height} = page.getSize();
    const font = await doc.embedFont(StandardFonts.Helvetica);

    let y = height - 50;
    const drawText = (text, size = 12, color = rgb(0, 0, 0)) => {
        page.drawText(text, {x: 50, y, size, font, color});
        y -= size + 10;
    };

    drawText('Relatório de Inspeção - Vasos de Pressão', 16, rgb(0.2, 0.2, 0.8));

    drawText(`Plataforma: ${form.plataforma}`);
    drawText(`Módulo: ${form.modulo}`);
    drawText(`Setor: ${form.setor}`);
    drawText(`Tipo de Equipamento: ${form.tipoEquipamento}`);
    drawText(`TAG do Equipamento: ${form.tag}`);
    drawText(`Data da Inspeção: ${format(parseISO(form.data), 'dd/MM/yyyy')}`);
    drawText(`Última Inspeção: ${format(parseISO(form.ultima), 'dd/MM/yyyy')}`);
    drawText(`Próxima Esperada: ${format(addDays(parseISO(form.ultima), 365), 'dd/MM/yyyy')}`);
    drawText(`Tipo de Dano: ${form.tipoDano}`);
    drawText(`Defeito: ${form.defeito}`);
    drawText(`Causa: ${form.causa}`);
    drawText(`Categoria RTI: ${form.categoriaRTI}`);
    drawText(`Recomendação: ${form.recomendacao}`);
    drawText(`Observações:`);
    drawText(form.observacoes || '(nenhuma)', 12);


    if (fotoBase64) {
        try {
            drawText('Foto incluída abaixo:', 12);

            const imageBytes = base64ToBytes(fotoBase64);
            if (imageBytes) {
                const imageType = getImageType(fotoBase64);
                let image;

                if (imageType === 'png') {
                    image = await doc.embedPng(imageBytes);
                } else if (imageType === 'jpg') {
                    image = await doc.embedJpg(imageBytes);
                } else {
                    throw new Error('Formato de imagem não suportado. Use PNG ou JPG/JPEG.');
                }

                const imgDims = image.scale(0.25);
                const imageY = y - imgDims.height - 10;

                page.drawImage(image, {
                    x: 50,
                    y: imageY > 50 ? imageY : 50,
                    width: imgDims.width,
                    height: imgDims.height
                });
            }
        } catch (error) {
            console.error('Erro ao processar foto:', error);
            drawText('(Erro ao processar foto)', 12, rgb(1, 0, 0));
        }
    }


    const pdfBytes = await doc.save();
    const blob = new Blob([pdfBytes], {type: 'application/pdf'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-${form.tag || 'inspecao'}.pdf`;
    link.click();
}

export async function gerarPdfsEmLote(inspecoes) {
    try {
        const doc = await PDFDocument.create();

        for (const inspecao of inspecoes) {
            const page = doc.addPage([595, 842]); // A4 em pontos
            const {width, height} = page.getSize();
            const font = await doc.embedFont(StandardFonts.Helvetica);

            try {
                // Carrega e adiciona a marca d'água
                const logoResponse = await fetch(logoUrl);
                const logoArrayBuffer = await logoResponse.arrayBuffer();
                const logoImage = await doc.embedPng(logoArrayBuffer);

                // Calcula as dimensões da marca d'água (50% do tamanho da página)
                const logoWidth = width * 0.5;
                const logoScale = logoWidth / logoImage.width;
                const logoHeight = logoImage.height * logoScale;

                // Desenha a marca d'água no centro da página com transparência
                page.drawImage(logoImage, {
                    x: (width - logoWidth) / 2,
                    y: (height - logoHeight) / 2,
                    width: logoWidth,
                    height: logoHeight,
                    opacity: 0.3
                });
            } catch (error) {
                console.error('Erro ao adicionar marca d\'água:', error);
            }

            let y = height - 50;
            const drawText = (text, size = 12, color = rgb(0, 0, 0)) => {
                page.drawText(text, {x: 50, y, size, font, color});
                y -= size + 10;
            };

            const dados = inspecao.form || inspecao;

            drawText(`Plataforma: ${dados.plataforma}`);
            drawText(`Módulo: ${dados.modulo}`);
            drawText(`Setor: ${dados.setor}`);
            drawText(`Tipo de Equipamento: ${dados.tipoEquipamento}`);
            drawText(`TAG do Equipamento: ${dados.tag}`);
            drawText(`Data da Inspeção: ${format(parseISO(dados.data), 'dd/MM/yyyy')}`);
            drawText(`Última Inspeção: ${format(parseISO(dados.ultima), 'dd/MM/yyyy')}`);
            drawText(`Próxima Esperada: ${format(addDays(parseISO(dados.ultima), 365), 'dd/MM/yyyy')}`);
            drawText(`Tipo de Dano: ${dados.tipoDano}`);
            drawText(`Defeito: ${dados.defeito}`);
            drawText(`Causa: ${dados.causa}`);
            drawText(`Categoria RTI: ${dados.categoriaRTI}`);
            drawText(`Recomendação: ${dados.recomendacao}`);
            drawText(`Observações:`);
            drawText(dados.observacoes || '(nenhuma)', 12);

            const foto = inspecao.foto;
            if (foto) {
                try {
                    drawText('Foto incluída abaixo:', 12);

                    const imageBytes = base64ToBytes(foto);
                    if (imageBytes) {
                        const imageType = getImageType(foto);
                        let image;

                        if (imageType === 'png') {
                            image = await doc.embedPng(imageBytes);
                        } else if (imageType === 'jpg') {
                            image = await doc.embedJpg(imageBytes);
                        } else {
                            throw new Error('Formato de imagem não suportado. Use PNG ou JPG/JPEG.');
                        }

                        const imgDims = image.scale(0.25);
                        const imageY = y - imgDims.height - 10;

                        page.drawImage(image, {
                            x: 50,
                            y: imageY > 50 ? imageY : 50,
                            width: imgDims.width,
                            height: imgDims.height
                        });
                    }
                } catch (error) {
                    console.error('Erro ao processar foto:', error);
                    drawText('(Erro ao processar foto)', 12, rgb(1, 0, 0));
                }
            }

        }

        // Salva o PDF único com todas as inspeções
        const pdfBytes = await doc.save();
        const blob = new Blob([pdfBytes], {type: 'application/pdf'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `relatorio-todas-inspecoes.pdf`;
        link.click();

        return true;
    } catch (error) {
        console.error('Erro ao gerar PDF consolidado:', error);
        throw error;
    }
}


