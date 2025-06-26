import React from 'react';
import {
    Button, Form, FormGroup, Label, Input, FormText, Col, Row, Alert
} from 'reactstrap';
import {FaCamera, FaSave, FaFilePdf} from 'react-icons/fa';

const FormularioInspecao = () => {

    return (
        <Form>
            <h3>Inspeção de Vasos de Pressão</h3>

            <FormGroup>
                <Label for="tag">TAG do Equipamento</Label>
                <Input type="text" name="tag" id="tag" required/>
            </FormGroup>

            <FormGroup>
                <Label for="data">Data da Inspeção</Label>
                <Input type="date" name="data" id="data" required/>
            </FormGroup>

            <FormGroup>
                <Label for="tipoDano">Tipo de Dano</Label>
                <Input type="select" name="tipoDano" id="tipoDano" required>
                    <option value="">Selecione</option>
                    <option value="localizado">Localizado</option>
                    <option value="disperso">Disperso</option>
                    <option value="generalizado">Generalizado</option>
                </Input>
            </FormGroup>

            <FormGroup>
                <Label for="observacoes">Observações</Label>
                <Input type="textarea" name="observacoes" id="observacoes"/>
            </FormGroup>

            <FormGroup>
                <Label for="foto"><FaCamera/> Foto</Label>
                <Input type="file" name="foto" id="foto" accept="image/*"/>
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
