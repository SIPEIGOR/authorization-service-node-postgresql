"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken =
  exports.getAllUsers =
  exports.getUserProfile =
  exports.changePassword =
  exports.loginUser =
  exports.registerUser =
    void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const database_1 = require("../config/database");
const user_entity_1 = require("../entities/user.entity");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const userRepository = database_1.AppDataSource.getRepository(
  user_entity_1.User
);
const registerUser = (data) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, firstName, lastName } = data;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    yield userRepository.save(user);
    return { message: "User created" };
  });
exports.registerUser = registerUser;
const loginUser = (data) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const user = yield userRepository.findOneBy({ email });
    if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    const accessToken = (0, auth_middleware_1.generateAccessToken)(
      user.id,
      user.email
    );
    const refreshToken = (0, auth_middleware_1.generateRefreshToken)(
      user.id,
      user.email
    );
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    yield userRepository.save(user);
    return { accessToken, refreshToken };
  });
exports.loginUser = loginUser;
const changePassword = (data) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email, oldPassword, newPassword } = data;
    const user = yield userRepository.findOneBy({ email });
    if (
      !user ||
      !(yield bcrypt_1.default.compare(oldPassword, user.password))
    ) {
      throw new Error("Invalid credentials");
    }
    user.password = yield bcrypt_1.default.hash(newPassword, 10);
    yield userRepository.save(user);
    return { message: "Password updated successfully" };
  });
exports.changePassword = changePassword;
const getUserProfile = (userId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findOneBy({ id: userId });
    if (!user) throw new Error("User not found");
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  });
exports.getUserProfile = getUserProfile;
const getAllUsers = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userRepository.find({
      select: ["id", "email", "firstName", "lastName"],
    });
    return users;
  });
exports.getAllUsers = getAllUsers;
const refreshToken = (data) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = data;
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const user = yield userRepository.findOneBy({ id: decoded.id });
      if (!user || user.refreshToken !== refreshToken) {
        throw new Error("Invalid refresh token");
      }
      const newAccessToken = (0, auth_middleware_1.generateAccessToken)(
        user.id,
        user.email
      );
      const newRefreshToken = (0, auth_middleware_1.generateRefreshToken)(
        user.id,
        user.email
      );
      user.accessToken = newAccessToken;
      user.refreshToken = newRefreshToken;
      yield userRepository.save(user);
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  });
exports.refreshToken = refreshToken;
