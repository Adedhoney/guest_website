import { Database } from '@infrastructure/Database';
import {
    AccountController,
    AdminController,
    PostController,
} from '@module/Controller';
import { AccountRepository, PostRepository } from '@module/Domain/Repository';
import { AccountService, AdminService, PostService } from '@module/Service';
import { Router } from 'express';

const router = Router();
const database = new Database();
const postrepo = new PostRepository(database);
const acctrepo = new AccountRepository(database);

const postctr = new PostController(new PostService(postrepo, acctrepo));
const acctctr = new AccountController(new AccountService(acctrepo));
const adminctr = new AdminController(new AdminService(postrepo, acctrepo));

// add validations with joi, authentications and or authorizations

router.post('/account/signup', acctctr.signUp);
router.post('/account/login', acctctr.logIn);
router.post('/account/update-info', acctctr.updateInfo);
router.post('/account/update-password', acctctr.updatePassword);

router.get('/account', acctctr.getUser);
router.delete('/account', acctctr.deleteUser);

router.post('/account/forgot-password/:email', acctctr.forgotPassword);
router.post('/account/verify-otp', acctctr.verifyOTP);
router.post('/account/reset-password', acctctr.resetPassword);

router.delete('/admin/account/delete/:userId', adminctr.deleteUser);
router.post('/admin/account/ban/:userId', adminctr.banUser);
router.delete('/admin/post/delete/:postId', adminctr.deletePost);

router.post('/post', postctr.savePost);
router.get('/post/:postId', postctr.getPost);
router.get('/post', postctr.getPosts);
router.delete('/post/:postId', postctr.deletePost);

export { router };
