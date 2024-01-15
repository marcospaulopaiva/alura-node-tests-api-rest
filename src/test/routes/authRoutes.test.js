/* eslint-disable no-undef */
import request from 'supertest';
import {
  afterEach, beforeEach, describe, it,
} from '@jest/globals';
import app from '../../app';

let servidor;
beforeEach(() => {
  const porta = 3000;
  servidor = app.listen(porta);
});

afterEach(() => {
  servidor.close();
});

describe('Testando a rota login (POST)', () => {
  it('O login deve possuir um e-mail e senha para se autenticar', async () => {
    // ARRANGE
    const loginMock = {
      email: 'mp@mp.com.br',
    };

    // ACT
    await request(servidor)
      .post('/login')
      .send(loginMock)
      .expect(500)// ASSERT
      .expect('"A senha de usuario é obrigatório."');
  });

  it('O login deve validar se o usuário está cadastrado', async () => {
    // ARRANGE
    const loginMock = {
      senha: 'senha123',
      email: 'mp3@mp.com.br',
    };

    // ACT
    await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(500)// ASSERT
      .expect('"Usuario não cadastrado."');
  });

  it('O login deve validar e-mail e senha incorreto', async () => {
    // ARRANGE
    const loginMock = {
      senha: '123senha',
      email: 'mp@mp.com.br',
    };

    // ACT
    await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(500)// ASSERT
      .expect('"Usuario ou senha invalido."');
  });

  it('O login deve validar se esta sendo retornado um accessToken', async () => {
    // ARRANGE
    const loginMock = {
      senha: 'senha123',
      email: 'mp@mp.com.br',
    };

    // ACT
    const resposta = await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(201);// ASSERT

    expect(resposta.body.message).toBe('Usuário conectado');
    expect(resposta.body).toHaveProperty('accessToken');
  });
});
