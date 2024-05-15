/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
import { faker } from '@faker-js/faker'

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios',
    }). should((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let nome = faker.person.fullName()
    let email = faker.internet.email(nome)
    cy.cadastrarUsuario(nome, email, 's123!', 'false')
    .should((response) => {
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      expect(response.status).to.equal(201)
    })
  });

  it('Deve validar um usuário com email inválido', () => {
    let nome = 'Usuário: ' +  faker.person.fullName()
    cy.cadastrarUsuario(nome, 'teste@qa.com', 's123!', 'true')
    .should((response) => {
      expect(response.status).equal(400)
      expect(response.body.message).to.equal('Este email já está sendo usado')
    }) 
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let nome = faker.person.fullName()
    let email = faker.internet.email(nome)
    cy.cadastrarUsuario(nome, email, 's123!', 'false')
    .then((response) => {
      let id = response.body._id
      cy.request({
        method: 'PUT',
        url: `usuarios/${id}`,
        body: {
          "nome": nome,
          "email": email,
          "password": "senha123",
          "administrador": "true"
        },
        failOnStatusCode: false
      }).should(response => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  });
  
  it('Deve deletar um usuário previamente cadastrado', () => {
    let nome = faker.person.fullName()
    let email = faker.internet.email(nome)
    cy.cadastrarUsuario(nome, email, 's123!', 'false')
    .then((response) => {
      let id = response.body._id
      cy.request({
        method: 'DELETE',
        url: `usuarios/${id}`
      }).should(response => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })
    })
  });
});
