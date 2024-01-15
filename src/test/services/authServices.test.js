import { describe, it, expect } from '@jest/globals';
import bcryptjs from 'bcryptjs';
import Usuario from '../../models/usuario';
import AuthService from '../../services/authService';

const authService = new AuthService();

describe('Testando a authService.cadastrarUsuario', () => {
  it('O usuário deve possuir um nome, email e senha', async () => {
    // ARRANGE
    const usuarioMock = {
      nome: 'Marcos Paulo',
      email: 'marcospaulo@teste.com.br',
    };
    // ACT
    const usuarioSalvo = authService.cadastrarUsuario(usuarioMock);
    // ASSERT
    await expect(usuarioSalvo).rejects.toThrowError('A senha de usuário é obrigatório!');
  });

  it('A senha do usuário precisa ser criptografada quando for salva no banco de dados', async () => {
    // ARRANGE
    const data = {
      nome: 'Marcos Paulo',
      email: 'marcospaulo@teste.com.br',
      senha: 'senha123',
    };
    // ACT
    const resultado = await authService.cadastrarUsuario(data);
    const senhaIguais = await bcryptjs.compare('senha123', resultado.content.senha);

    // ASSERT
    expect(senhaIguais).toStrictEqual(true);

    await Usuario.excluir(resultado.content.id);
  });

  it('Não pode ser cadastrado um usuário com e-mail duplicado', async () => {
    // ARRANGE
    const usuarioMock = {
      nome: 'Marcos Paulo',
      email: 'mp@mp.com.br',
      senha: 'senha123',
    };

    // ACT
    const usuarioSave = authService.cadastrarUsuario(usuarioMock);

    // ASSERT
    await expect(usuarioSave).rejects.toThrowError('O email já esta cadastrado!');
  });

  it('Ao cadastrar um usuário deve ser retornada uma mensagem informando que o usuário foi cadastrado', async () => {
    const data = {
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senha: 'senha123',
    };

    const resultado = await authService.cadastrarUsuario(data);

    expect(resultado.message).toEqual('usuario criado');

    await Usuario.excluir(resultado.content.id);
  });

  it('Ao cadastrar um usuário, validar o retorno das informações do usuário', async () => {
    const data = {
      nome: 'John Doe',
      email: 'johndoe@example.com',
      senha: 'senha123',
    };

    const resultado = await authService.cadastrarUsuario(data);

    expect(resultado.content).toMatchObject(data);

    await Usuario.excluir(resultado.content.id);
  });
});
