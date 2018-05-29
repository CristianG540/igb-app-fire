import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, timeout } from 'rxjs/operators';

// Libs terceros
import _ from 'lodash';

// Providers
import { AuthProvider } from '../../providers/auth/auth';
import { ConfigProvider as cg } from '../../providers/config/config';

@Injectable()
export class ClientesProvider {

  constructor(
    private http: HttpClient,
    private authServ: AuthProvider,
  ) {
    console.log('Hello ClientesProvider Provider');
  }

  /**
   * Esta funcion se encarga de buscar los clientes del asesor
   * actualmente logueado en la app, los busca por el nombre del cliente
   * con el motor de busqueda lucene de cloudant, este metodo tambien hace
   * uso del api async/await de ecmascript 7 si no estoy mal
   *
   * @param {string} query
   * @returns {Promise<any>}
   * @memberof ClientesProvider
   */
  public async searchCliente(query: string): Promise<any> {
    /**
     * Bueno aqui hago todo lo contrario a lo que hago con los productos
     * en vez de hacer un offline first (que deberia ser lo correcto)
     * hago un online first por asi decirlo, lo que hago es buscar primero
     * en cloudant/couchdb por los clientes, si por algun motivo no los puedo
     * traer digace fallo de conexion o lo que sea, entonces busco los clientes
     * en la base de datos local
     */
    const url: string = `${cg.ELASTIC_URL}/_search`;
    const params = new HttpParams()
      .set('q', `doc.nombre_cliente:"${query}"~ AND doc.asesor:"${this.authServ.userData.idAsesor}"`);
    const options = {
      headers: new HttpHeaders({
        'Accept'       : 'application/json',
        'Content-Type' : 'application/json',
      }),
      params: params,
    };

    /**
     * aqui haciendo uso del async/await hago un try/catch que primero
     * intenta traer los datos mediante http de elsaticsearch, si por algun motivo
     * la petcion falla entonces el catch se encarga de buscar los clientes
     * en la bd local pouchdb
     */
    try {

      const res = await this.http.get( url, options ).pipe(
        map((response: any) => {
          return response;
        }),
        timeout(5000),
      ).toPromise();

      const data = { rows: [] };
      data.rows = _.map(res.hits.hits, (hit: any) => {
        return hit._source;
      });

      return data;

    } catch (error) {
      console.error('Error buscando clientes online searchCliente cliente.ts: ', error);
    }

  }

}
