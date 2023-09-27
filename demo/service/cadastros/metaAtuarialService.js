import axios from "axios";

export class metaAtuarialService {

    url = 'http://localhost:8080/api/servico/'

    listarTodos() {
        return axios.get(this.url);
    }

    inserir(objeto) {
        return axios.post(this.url, objeto);
    }


    alterar(objeto) {
        return axios.put(this.url, objeto);
    }

    excluir(id) {
        return axios.delete(this.url + id)
    }
}