"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const user_entity_1 = require("../entities/user.entity");
const jwt_1 = require("../utils/jwt");
const userRepository = database_1.AppDataSource.getRepository(user_entity_1.User);
const registerUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = userRepository.create({ email, password: hashedPassword });
    yield userRepository.save(user);
    return { message: "User created" };
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findOneBy({ email });
    if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
        throw new Error("Invalid credentials");
    }
    const token = (0, jwt_1.generateToken)(user.id, user.email);
    return { token };
});
exports.loginUser = loginUser;
