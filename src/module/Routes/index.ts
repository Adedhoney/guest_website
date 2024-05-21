import { Database } from '@infrastructure/Database';
import {
    AccountController,
    AdminController,
    PostController,
} from '@module/Controller';
import { AccountRepository, PostRepository } from '@module/Domain/Repository';
import { Authentication, Authorization, Validation } from '@module/Middleware';
import { AccountService, AdminService, PostService } from '@module/Service';
import {
    LogInSchema,
    ResetPasswordSchema,
    SavePostSchema,
    SignUpSchema,
    UpdateInfoSchema,
    UpdatePassWordSchema,
    VerifyOtpSchema,
} from '@module/Validation';
import { Router } from 'express';

const router = Router();
const database = new Database();
const postrepo = new PostRepository(database);
const acctrepo = new AccountRepository(database);

const postctr = new PostController(
    new PostService(postrepo, acctrepo),
    acctrepo,
);
const acctctr = new AccountController(new AccountService(acctrepo));
const adminctr = new AdminController(new AdminService(postrepo, acctrepo));
const auth = Authentication(acctrepo);

// add validations with joi, authentications and or authorizations

router.post('/account/signup', Validation(SignUpSchema), acctctr.signUp);
router.post('/account/login', Validation(LogInSchema), acctctr.logIn);
router.post(
    '/account/update-info',
    auth,
    Validation(UpdateInfoSchema),
    acctctr.updateInfo,
);
router.post(
    '/account/update-password',
    auth,
    Validation(UpdatePassWordSchema),
    acctctr.updatePassword,
);

router.get('/account', auth, acctctr.getUser);
router.delete('/account', auth, acctctr.deleteUser);

router.post('/account/forgot-password/:email', auth, acctctr.forgotPassword);
router.post(
    '/account/verify-otp',
    auth,
    Validation(VerifyOtpSchema),
    acctctr.verifyOTP,
);
router.post(
    '/account/reset-password',
    auth,
    Validation(ResetPasswordSchema),
    acctctr.resetPassword,
);

router.delete(
    '/admin/account/delete/:userId',
    auth,
    Authorization,
    adminctr.deleteUser,
);
router.post(
    '/admin/account/ban/:userId',
    auth,
    Authorization,
    adminctr.banUser,
);
router.delete(
    '/admin/post/delete/:postId',
    auth,
    Authorization,
    adminctr.deletePost,
);

router.post('/post', Validation(SavePostSchema), postctr.savePost);
router.get('/post/:postId', auth, postctr.getPost);
router.get('/post', auth, postctr.getPosts);
router.delete('/post/:postId', auth, postctr.deletePost);

export { router };
