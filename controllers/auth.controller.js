import { SiweMessage, generateNonce } from "siwe";
import Wallet from "../models/wallet.js";
import { generateWallet } from "../blockchain/utils.js";
import User from "../models/user.js";

const getNonce = async (req, res) => {
  req.session.nonce = generateNonce();
  res.status(200).json({ nonce: req.session.nonce });
};

const verifyNonce = async function (req, res) {
  try {
    if (!req.body.message) {
      res
        .status(422)
        .json({ message: "Expected prepareMessage object as body." });
      return;
    }

    let SIWEObject = new SiweMessage(req.body.message);
    const { data: message } = await SIWEObject.verify({
      signature: req.body.signature,
      nonce: req.session.nonce,
    });
    req.session.siwe = message;
    req.session.user = message.address;
    req.session.cookie.expires = new Date(message.expirationTime);

    const user = await User.findOne({ address: message.address });
    if (!user) {
      // Create a new user with new wallets
      const newUser = new User({
        address: message.address,
      });

      await newUser.save();
      const newWallets = [generateWallet()];

      const wallets = await Promise.all(
        newWallets.map(async (wallet, index) => {
          const newWallet = new Wallet({
            address: wallet.address,
            privateKey: wallet.key,
            owner: message.address,
            name: index == 0 ? "Main" : `Wallet${index + 1}`,
          });
          await newWallet.save();
          return { address: wallet.address, name: newWallet.name };
        })
      );

      req.session.save(() =>
        res.status(200).send({ user: message.address, wallets })
      );
    } else {
      const walletsObjs = await Wallet.find({ owner: message.address });
      const wallets = walletsObjs.map((wallet) => {
        return { address: wallet.address, name: wallet.name };
      });

      req.session.save(() =>
        res.status(200).send({ user: message.address, wallets })
      );
    }
  } catch (e) {
    req.session.siwe = null;
    req.session.nonce = null;

    switch (e) {
      case ErrorTypes.EXPIRED_MESSAGE: {
        req.session.save(() => res.status(440).json({ message: e.message }));
        break;
      }
      case ErrorTypes.INVALID_SIGNATURE: {
        req.session.save(() => res.status(422).json({ message: e.message }));
        break;
      }
      default: {
        req.session.save(() => res.status(500).json({ message: e.message }));
        break;
      }
    }
  }
};

const createUser = async function (req, res) {
  const { address } = req.body;
  const user = await Wallet.findOne({ address: address });
  const newWallet = generateWallet();
  const wallet = new Wallet({
    address: newWallet.address,
    privateKey: newWallet.key,
    owner: address,
  });
  await wallet.save();
  res.status(200).send({ address: address });
};

const checkStatus = async function (req, res) {
  const user = req.session?.user;
  // console.log();

  if (!user) {
    res.status(401).send({ error: "Unauthenticated" });
    return;
  }
  console.log(user);
  const wallets = [];
  if (user) {
    const userObj = await User.findOne({ address: user });
    if (userObj) {
      const userWallets = await Wallet.find({ owner: user });
      userWallets.forEach((wallet) => {
        wallets.push({ address: wallet.address, name: wallet.name });
      });
    }
  }
  if (user) res.status(200).send({ user: user, wallets });
};
export default {
  getNonce,
  verifyNonce,
  createUser,
  checkStatus,
};
