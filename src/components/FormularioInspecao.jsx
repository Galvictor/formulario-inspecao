import React, {useState} from 'react';
import {
    Button, Form, FormGroup, Label, Input, FormText, Col, Row, Alert, Card, CardBody, Container
} from 'reactstrap';
import {FaCamera, FaSave, FaFilePdf} from 'react-icons/fa';
import {addDays, isAfter, parseISO, format} from 'date-fns';
import {saveDataToIndexedDB} from '../data/db';
import {gerarPdfInspecao} from "../utils/pdf.js";
import {opcoesFormulario} from '../data/opcoes.js';


const FormularioInspecao = () => {

    const estadoInicial = {
        plataforma: '',
        modulo: '',
        setor: '',
        tipoEquipamento: '',
        tag: '',
        defeito: '',
        causa: '',
        categoriaRTI: '',
        recomendacao: '',
        ultima: '',
        data: '',
        tipoDano: '',
        observacoes: '',
        foto: null
    };


    const [form, setForm] = useState(estadoInicial);

    const [previewFoto, setPreviewFoto] = useState(null);
    const [sucesso, setSucesso] = useState(false);

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (name === 'foto') {
            const file = files[0];
            setForm({...form, foto: file});
            const reader = new FileReader();
            reader.onloadend = () => setPreviewFoto(reader.result);
            reader.readAsDataURL(file);
        } else {
            setForm({...form, [name]: value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Salva os dados
            await saveDataToIndexedDB({form, foto: previewFoto});

            // Gera o PDF
            await gerarPdfInspecao(form, previewFoto);

            // Mostra mensagem de sucesso
            setSucesso(true);

            // Resetar formulário
            setForm(estadoInicial);
            setPreviewFoto(null);

            // Ocultar alerta após 3 segundos
            setTimeout(() => setSucesso(false), 3000);
        } catch (error) {
            console.error('Erro ao salvar dados ou gerar PDF:', error);
            alert('Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
        }
    };


    const isVencido = () => {
        if (!form.ultima) return false;
        const dataUltima = parseISO(form.ultima);
        const limite = addDays(dataUltima, 365);
        return isAfter(new Date(), limite); // hoje > limite ?
    };


    return (
        <Container>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow">
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <h3 className="text-center mb-4">Inspeção de Vasos de Pressão</h3>

                                {sucesso && (
                                    <Alert color="success" className="text-center">
                                        Dados salvos com sucesso!
                                    </Alert>
                                )}

                                <FormGroup className="mb-3">
                                    <Label className="fw-bold">Plataforma</Label>
                                    <Input type="select" name="plataforma" required value={form.plataforma}
                                           onChange={handleChange}>
                                        <option value="">Selecione</option>
                                        {opcoesFormulario.plataforma.map(p => <option key={p} value={p}>{p}</option>)}
                                    </Input>
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <Label className="fw-bold">Módulo</Label>
                                    <Input type="select" name="modulo" required value={form.modulo}
                                           onChange={handleChange}>
                                        <option value="">Selecione</option>
                                        {opcoesFormulario.modulo.map(m => <option key={m} value={m}>{m}</option>)}
                                    </Input>
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <Label className="fw-bold">Setor</Label>
                                    <Input type="select" name="setor" required value={form.setor}
                                           onChange={handleChange}>
                                        <option value="">Selecione</option>
                                        {opcoesFormulario.setor.map(s => <option key={s} value={s}>{s}</option>)}
                                    </Input>
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <Label className="fw-bold">Tipo de Equipamento</Label>
                                    <Input
                                        type="select"
                                        name="tipoEquipamento"
                                        required
                                        value={form.tipoEquipamento}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione</option>
                                        {opcoesFormulario.tipoEquipamento.map(tipo => <option key={tipo}
                                                                                              value={tipo}>{tipo}</option>)}
                                    </Input>
                                </FormGroup>

                                {form.tipoEquipamento && (
                                    <FormGroup className="mb-3">
                                        <Label className="fw-bold">TAG</Label>
                                        <Input type="select" name="tag" required value={form.tag}
                                               onChange={handleChange}>
                                            <option value="">Selecione</option>
                                            {opcoesFormulario.tag[form.tipoEquipamento].map(tag => <option key={tag}
                                                                                                           value={tag}>{tag}</option>)}
                                        </Input>
                                    </FormGroup>
                                )}


                                <FormGroup className="mb-3">
                                    <Label for="tag" className="fw-bold">TAG do Equipamento</Label>
                                    <Input type="text" name="tag" id="tag" required value={form.tag}
                                           onChange={handleChange} className="form-control-lg"/>
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <Label for="ultima" className="fw-bold">Data da Última Inspeção</Label>
                                    <Input
                                        type="date"
                                        name="ultima"
                                        id="ultima"
                                        required
                                        value={form.ultima}
                                        onChange={handleChange}
                                        className="form-control-lg"
                                    />
                                    {form.ultima && (
                                        <div className="mt-2 p-3 bg-light rounded">
                                            <div className="mb-1">
                                                📅 <strong>Hoje:</strong> {format(new Date(), 'dd/MM/yyyy')}
                                            </div>
                                            <div className="mb-1">
                                                📌 <strong>Próxima inspeção
                                                esperada:</strong> {format(addDays(parseISO(form.ultima), 365), 'dd/MM/yyyy')}
                                            </div>
                                            <div
                                                className={`small ${isVencido() ? 'text-danger' : 'text-success'} fw-bold`}>
                                                {isVencido() ? '❌ Inspeção vencida!' : '✅ Inspeção em dia.'}
                                            </div>
                                        </div>
                                    )}
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <Label for="data" className="fw-bold">Data da inspeção</Label>
                                    <Input
                                        type="date"
                                        name="data"
                                        id="data"
                                        required
                                        value={form.data}
                                        onChange={handleChange}
                                        className="form-control-lg"
                                    />
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <Label for="tipoDano" className="fw-bold">Tipo de Dano</Label>
                                    <Input type="select" name="tipoDano" id="tipoDano" required
                                           value={form.tipoDano} onChange={handleChange}
                                           className="form-control-lg">
                                        <option value="">Selecione</option>
                                        <option value="localizado">Localizado</option>
                                        <option value="disperso">Disperso</option>
                                        <option value="generalizado">Generalizado</option>
                                    </Input>
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <Label className="fw-bold">Defeito</Label>
                                    <Input type="select" name="defeito" required value={form.defeito}
                                           onChange={handleChange}>
                                        <option value="">Selecione</option>
                                        {opcoesFormulario.defeito.map(d => <option key={d} value={d}>{d}</option>)}
                                    </Input>
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <Label className="fw-bold">Causa</Label>
                                    <Input type="select" name="causa" required value={form.causa}
                                           onChange={handleChange}>
                                        <option value="">Selecione</option>
                                        {opcoesFormulario.causa.map(c => <option key={c} value={c}>{c}</option>)}
                                    </Input>
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <Label className="fw-bold">Categoria RTI</Label>
                                    <Input type="select" name="categoriaRTI" required value={form.categoriaRTI}
                                           onChange={handleChange}>
                                        <option value="">Selecione</option>
                                        {opcoesFormulario.categoriaRTI.map(cat => <option key={cat}
                                                                                          value={cat}>{cat}</option>)}
                                    </Input>
                                </FormGroup>

                                <FormGroup className="mb-3">
                                    <Label className="fw-bold">Recomendação</Label>
                                    <Input type="select" name="recomendacao" required value={form.recomendacao}
                                           onChange={handleChange}>
                                        <option value="">Selecione</option>
                                        {opcoesFormulario.recomendacao.map(r => <option key={r} value={r}>{r}</option>)}
                                    </Input>
                                </FormGroup>


                                <FormGroup className="mb-3">
                                    <Label for="observacoes" className="fw-bold">Observações</Label>
                                    <Input type="textarea" name="observacoes" id="observacoes"
                                           value={form.observacoes} onChange={handleChange}
                                           className="form-control-lg" rows="4"/>
                                </FormGroup>

                                <FormGroup className="mb-4">
                                    <Label for="foto" className="fw-bold"><FaCamera/> Foto</Label>
                                    <Input type="file" name="foto" id="foto" accept="image/*"
                                           onChange={handleChange} className="form-control-lg"/>
                                    {previewFoto && (
                                        <div className="text-center mt-3">
                                            <img src={previewFoto} alt="Preview"
                                                 className="img-thumbnail"
                                                 style={{maxWidth: '300px'}}/>
                                        </div>
                                    )}
                                </FormGroup>

                                <Row className="mt-4">
                                    <Col className="d-grid gap-2 d-md-flex justify-content-md-center">
                                        <Button color="primary" size="lg" type="submit">
                                            <FaSave className="me-2"/> Salvar & Gerar PDF
                                        </Button>
                                    </Col>
                                </Row>

                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );

};

export default FormularioInspecao;
