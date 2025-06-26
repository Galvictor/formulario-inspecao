import React, {useState} from 'react';
import {
    Button, Form, FormGroup, Label, Input, FormText, Col, Row, Alert
} from 'reactstrap';
import {FaCamera, FaSave, FaFilePdf} from 'react-icons/fa';
import {differenceInDays} from 'date-fns';

const FormularioInspecao = () => {
    const [form, setForm] = useState({
        tag: '',
        ultima: '',
        proxima: '',
        tipoDano: '',
        observacoes: '',
        foto: null
    });
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
        setSucesso(true);
        setTimeout(() => setSucesso(false), 3000);
        console.log('Dados salvos:', form);
    };

    const isVencido = () => {
        if (!form.proxima) return false;
        const diasRestantes = differenceInDays(new Date(form.proxima), new Date());
        return diasRestantes < 0;
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3>Inspeção de Vasos de Pressão</h3>

            {sucesso && <Alert color="success">Dados salvos com sucesso!</Alert>}

            <FormGroup>
                <Label for="tag">TAG do Equipamento</Label>
                <Input type="text" name="tag" id="tag" required value={form.tag} onChange={handleChange}/>
            </FormGroup>

            <FormGroup>
                <Label for="ultima">Data da Última Inspeção</Label>
                <Input
                    type="date"
                    name="ultima"
                    id="ultima"
                    required
                    value={form.ultima}
                    onChange={handleChange}
                />
            </FormGroup>

            <FormGroup>
                <Label for="proxima">Data da Próxima Inspeção</Label>
                <Input
                    type="date"
                    name="proxima"
                    id="proxima"
                    required
                    value={form.proxima}
                    onChange={handleChange}
                />
                {form.proxima && (
                    <div className={`small ${isVencido() ? 'text-danger' : 'text-success'}`}>
                        {isVencido() ? 'Inspeção vencida!' : 'Inspeção em dia.'}
                    </div>
                )}
            </FormGroup>

            <FormGroup>
                <Label for="tipoDano">Tipo de Dano</Label>
                <Input type="select" name="tipoDano" id="tipoDano" required value={form.tipoDano}
                       onChange={handleChange}>
                    <option value="">Selecione</option>
                    <option value="localizado">Localizado</option>
                    <option value="disperso">Disperso</option>
                    <option value="generalizado">Generalizado</option>
                </Input>
            </FormGroup>

            <FormGroup>
                <Label for="observacoes">Observações</Label>
                <Input type="textarea" name="observacoes" id="observacoes" value={form.observacoes}
                       onChange={handleChange}/>
            </FormGroup>

            <FormGroup>
                <Label for="foto"><FaCamera/> Foto</Label>
                <Input type="file" name="foto" id="foto" accept="image/*" onChange={handleChange}/>
                {previewFoto && (
                    <img src={previewFoto} alt="Preview" style={{maxWidth: '200px', marginTop: '10px'}}/>
                )}
            </FormGroup>

            <Row className="mt-4">
                <Col>
                    <Button color="primary" type="submit"><FaSave/> Salvar</Button>
                </Col>
                <Col>
                    <Button color="danger" type="button">
                        <FaFilePdf/> Gerar PDF
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default FormularioInspecao;
