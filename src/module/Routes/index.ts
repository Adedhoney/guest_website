import { Database } from '@infrastructure/Database';
import { PostController } from '@module/Controller';
import { PostRepository } from '@module/Domain/Repository';
import { PostService } from '@module/Service';
import { Router } from 'express';

const router = Router();
const database = new Database();
const postrepo = new PostRepository(database);

const postctr = new PostController(new PostService(postrepo));

// add validations with joi, authentications and or authorizations
router.post('/post', postctr.savePost);

export { router };
