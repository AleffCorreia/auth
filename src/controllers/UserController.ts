import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';
import Validation from '../config/Validation';

class UserController {
  async index(request: Request, response: Response) {
    const userRepository = getRepository(User);

    await userRepository.find()
      .then((users) => response.status(200).json({ data: users }))
      .catch((e) => response.status(500).json(e));
  }

  async show(request: Request, response: Response) {
    const userRepository = getRepository(User);
    const { id } = request.params;

    await userRepository.findOne(id)
      .then((user) => response.status(200).json({ data: user }))
      .catch((e) => response.status(500).json(e));
  }

  async create(request: Request, response: Response) {
    const userRepository = getRepository(User);
    const {
      username, email, inputSecret, confirmSecret,
    } = request.body;
    const validator = new Validation();

    try {
      validator.existsOrError(username, 'The username field is missing!');
      validator.existsOrError(email, 'The email fidel is missing!');
      validator.existsOrError(inputSecret, 'The password field is missing!');
      validator.existsOrError(confirmSecret, 'The confirm password field is missing!');
      validator.equalsOrError(inputSecret, confirmSecret, "Password's field's not equals");
    } catch (e) {
      response.status(400).json({ message: e });
    }

    const secret = await hash(inputSecret, 10);

    const user = userRepository.create({
      username,
      email,
      secret,
    });

    await userRepository.save(user)
      .then(() => response.status(201).json({ message: 'created' }))
      .catch((e) => {
        if (e.message.includes('users.username')) {
          response.status(400).json({ message: 'Username already exists' });
        } else if (e.message.includes('users.email')) {
          response.status(400).json({ message: 'Email already exists' });
        } else { response.status(500).json({ message: 'Internal Server Error' }); }
      });
  }

  async update(request: Request, response: Response) {
    const userRepository = getRepository(User);
    const {
      username, email,
    } = request.body;
    const { id } = request.params;
    const validator = new Validation();

    try {
      validator.existsOrError(username, 'The username field is missing!');
      validator.existsOrError(email, 'The email fidel is missing!');

      const checkUser = await userRepository.findOne({ id });
      const checkUsername = await userRepository.findOne({ username });
      const checkUserEmail = await userRepository.findOne({ email });

      validator.existsOrError(checkUser, 'User not found!');

      if (checkUser) {
        if (checkUserEmail && checkUserEmail.email !== checkUser.email) {
          response.status(400).json({ message: 'Email already exists' });
        } else if (checkUsername && checkUsername.username !== checkUser.username) {
          response.status(400).json({ message: 'Username already exists' });
        }
      }
    } catch (e) {
      response.status(400).json({ message: e });
    }

    await userRepository.update({ id }, { username, email })
      .then(() => response.status(200).json({ message: 'updated' }))
      .catch((e) => response.status(500).json(e));
  }
}

export default UserController;
