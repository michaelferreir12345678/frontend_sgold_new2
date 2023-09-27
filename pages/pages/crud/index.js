import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../service/ProductService';
import { metaAtuarialService } from '../../../service/cadastros/metaAtuarialService';

const Crud = () => {
    let objetoNovo = {
        seq_meta_atuarial: null,
        dataInicio: '', //name = "DAT_META" início da vigência
        indice: 0, //name = "COD_INDICE" indicador de desemmprenho 
        valorAdicional: 0, //name="VLR_META_ADC" taxa real de juros
    };

    const [objetos, setObjetos] = useState(null);
    const [objetoDialog, setObjetoDialog] = useState(false);
    const [objetoDeleteDialog, setObjetoDeleteDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [objeto, setObjeto] = useState(objetoNovo);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const objetoService = new metaAtuarialService()

    useEffect(() => {
        if (objetos == null) {
            objetoService.listarTodos()
                .then(res => {
                    setObjetos(res.data)
                });
        }
    }, [objetos],
    );


    const formatCurrency = (value) => new Intl.NumberFormat("pt-BR", {
        style: "percent",
        maximumFractionDigits: 2
    }).format(value);

    const formatData = (value) => new Intl.DateTimeFormat("pt-BR", {
        timeZone: 'UTC'
    }).format(value);

    const openNew = () => {
        setObjeto(objetoNovo);
        setSubmitted(false);
        setObjetoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setObjetoDialog(false);
    };

    const hideDeleteObjetoDialog = () => {
        setObjetoDeleteDialog(false);
    };

    const saveObject = () => {
        setSubmitted(true);
        let _objeto = { ...objeto };
        if (objeto.id) {
            objetoService.alterar(_objeto)
                .then(data => {
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Alterado com Sucesso', life: 3000 });
                    setObjetos(null);
                });
        } else {
            objetoService.inserir(_objeto)
                .then(data => {
                    console.log(_objeto)
                    toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Inserido com Sucesso', life: 3000 });
                    setObjetos(null);
                });
        }
        setObjetoDialog(false);
        setObjeto(objetoNovo);
        console.log(objeto.seq_meta_atuarial)

    };

    const editObjeto = (objeto) => {
        setObjeto({ ...objeto });
        setObjetoDialog(true);
    };

    const confirmDeleteObjeto = (objeto) => {
        setObjeto(objeto);
        setObjetoDeleteDialog(true);
    };

    const deleteObjeto = () => {
        objetoService.excluir(objeto.id)
            .then(data => {
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Removido', life: 3000 });
                setObjetos(null);
                setObjetoDeleteDialog(false);
            });
    };

    const onInputChange = (e, nome) => {
        const val = (e.target && e.target.value) || '';
        let _objeto = { ...objeto };
        _objeto[`${nome}`] = val;

        setObjeto(_objeto);
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onCategoryChange = (e) => {
        let _objeto = { ...objeto };
        _objeto['indice'] = e.value;
        setObjeto(_objeto);
    };

    const onInputNumberChange = (e, nome) => {
        const val = e.value || 0;
        let _objeto = { ...objeto };
        _objeto[`${nome}`] = val / 100;
        setObjeto(_objeto);
    };

    //***************************************************************************************** */

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nova meta" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    {/* <Button label="Deletar meta" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> Botão para se preciso add caixinhas para seleção */}
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };

    const indiceBodyTemplate = (rowData) => {
        if (rowData.indice == '11') {
            return (
                <>
                    <span className="p-column-title">Indice</span>
                    SELIC
                </>
            )
        } else if (rowData.indice == '433') {
            return (
                <>
                    <span className="p-column-title">Indice</span>
                    IPCA
                </>
            )
        } else if (rowData.indice == '189') {
            return (
                <>
                    <span className="p-column-title">Indice</span>
                    IGPM
                </>
            )
        } else if (rowData.indice == '188') {
            return (
                <>
                    <span className="p-column-title">Indice</span>
                    INPC
                </>
            )
        }

    };

    const dataInicioBodyTemplate = (rowData) => {
        let data = new Date(rowData.dataInicio);
        return (
            <>
                <span className="p-column-title">Início da Vigência</span>
                {formatData(data)}
            </>
        );
    };

    const valorAdicionalBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Taxa Real de Juros (a.a.): </span>
                {formatCurrency((rowData.valorAdicional))}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" /*rounded*/ severity="success" className="mr-2" onClick={() => editObjeto(rowData)} />
                <Button icon="pi pi-trash" /*rounded*/ severity="warning" onClick={() => confirmDeleteObjeto(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Cadastro de Meta Atuarial (Anual)</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
            </span>
        </div>
    );

    const objetoDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveObject} />
        </>
    );
    const deleteObjetoDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteObjetoDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteObjeto} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={objetos}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={12}
                        rowsPerPageOptions={[5, 12, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last}. Total de {totalRecords}"
                        globalFilter={globalFilter}
                        emptyMessage="Sem objetos cadastrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        {/* <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column> */}
                        <Column field="id" header="ID" sortable body={idBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="indice" header="Indice" sortable body={indiceBodyTemplate} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="dataInicio" header="dataInicio" body={dataInicioBodyTemplate} sortable headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="valorAdicional" header="valorAdicional" type='number' body={valorAdicionalBodyTemplate} sortable></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}> </Column>
                    </DataTable>

                    <Dialog visible={objetoDialog} style={{ width: '450px' }} header="Inserir meta" modal className="p-fluid" footer={objetoDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="dataInicio">Data de inicio vigência</label>
                            <InputText type='date' id="dataInicio" value={objeto.dataInicio} onChange={(e) => onInputChange(e, 'dataInicio')} required autoFocus className={classNames({ 'p-invalid': submitted && !objeto.dataInicio })} />
                            {submitted && !objeto.dataInicio && <small className="p-invalid">Data é requerida.</small>}
                        </div>

                        <div className="field">
                            <label className="mb-3">Indice</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="indice1" name="indice" value='11' onChange={onCategoryChange} checked={objeto.indice === '11'} />
                                    <label htmlFor="indice1">SELIC</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="indice2" name="indice" value="433" onChange={onCategoryChange} checked={objeto.indice === '433'} />
                                    <label htmlFor="indice2">IPCA</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="indice3" name="indice" value="189" onChange={onCategoryChange} checked={objeto.indice === '189'} />
                                    <label htmlFor="indice3">IGPM</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="indice4" name="indice" value="188" onChange={onCategoryChange} checked={objeto.indice === '188'} />
                                    <label htmlFor="indice4">INPC</label>
                                </div>
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="valorAdicional">Valor</label>
                                <InputNumber mode='decimal' maxFractionDigits={6} minFractionDigits={1} id="valorAdicional" value={objeto.valorAdicional} onValueChange={(e) => onInputNumberChange(e, 'valorAdicional')} />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={objetoDeleteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteObjetoDialogFooter} onHide={hideDeleteObjetoDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {objeto && (
                                <span>
                                    Deseja excluir?<b>{objeto.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
export default Crud;
