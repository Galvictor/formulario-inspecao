import {PDFDocument, rgb, StandardFonts} from 'pdf-lib';
import {addDays, parseISO, format} from 'date-fns';
import logoUrl from '../assets/logo.png'; // Importa a logo diretamente

// Utilitário para converter base64 para array de bytes
const base64ToBytes = (base64) => {
    const binary = atob(base64.split(',')[1]);
    return Uint8Array.from([...binary].map((char) => char.charCodeAt(0)));
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

    drawText(`TAG do Equipamento: ${form.tag}`);
    drawText(`Data da Inspeção: ${format(parseISO(form.data), 'dd/MM/yyyy')}`);
    drawText(`Última Inspeção: ${format(parseISO(form.ultima), 'dd/MM/yyyy')}`);
    drawText(`Próxima Esperada: ${format(addDays(parseISO(form.ultima), 365), 'dd/MM/yyyy')}`);
    drawText(`Tipo de Dano: ${form.tipoDano}`);
    drawText(`Observações:`);
    drawText(form.observacoes || '(nenhuma)', 12);

    if (fotoBase64) {
        drawText('Foto incluída abaixo:', 12);

        const imageBytes = base64ToBytes(fotoBase64);
        const image = await doc.embedJpg(imageBytes);
        const imgDims = image.scale(0.25);

        const imageY = y - imgDims.height - 10;

        page.drawImage(image, {
            x: 50,
            y: imageY > 50 ? imageY : 50,
            width: imgDims.width,
            height: imgDims.height
        });
    }

    const pdfBytes = await doc.save();
    const blob = new Blob([pdfBytes], {type: 'application/pdf'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-${form.tag || 'inspecao'}.pdf`;
    link.click();
}