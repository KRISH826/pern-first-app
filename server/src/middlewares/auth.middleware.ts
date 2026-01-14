import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

interface CognitoToken extends JwtPayload {
    sub: string;
    "custom:role"?: "tenant" | "manager";
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: "tenant" | "manager";
            };
        }
    }
}

const client = jwksClient({
    jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
});

const getKey = (header: any, callback: any) => {
    client.getSigningKey(header.kid, (err, key) => {
        callback(null, key?.getPublicKey());
    });
};

export const authMiddleware =
    (allowedRoles: ("tenant" | "manager")[]) =>
        (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                return res.status(401).json({ message: "Missing token" });
            }

            jwt.verify(
                token,
                getKey,
                {
                    issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
                },
                (err, decoded) => {
                    if (err) {
                        return res.status(401).json({ message: "Invalid token" });
                    }

                    const payload = decoded as CognitoToken;
                    const role = payload["custom:role"];

                    if (!role || !allowedRoles.includes(role)) {
                        return res.status(403).json({ message: "Forbidden" });
                    }

                    req.user = {
                        id: payload.sub, // cognito_sub
                        role,
                    };

                    next();
                }
            );
        };
