import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

interface CognitoPayload extends JwtPayload {
    sub: string;
    email?: string;
    "custom:role"?: string;
}

const client = jwksClient({
    jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
});

function getKey(header: any, callback: any) {
    client.getSigningKey(header.kid, (err, key) => {
        callback(err, key?.getPublicKey());
    });
}

export const authMiddleware = (allowedRoles: ("tenant" | "manager")[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing token" });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(
            token,
            getKey,
            {
                algorithms: ["RS256"],
                issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
            },
            (err, decoded) => {
                if (err) {
                    console.error("JWT Verification Error:", err);
                    return res.status(401).json({ message: "Invalid token" });
                }

                const payload = decoded as CognitoPayload;
                console.log("Decoded Token Payload:", JSON.stringify(payload, null, 2));

                const role = payload["custom:role"];

                if (!role || !allowedRoles.includes(role as any)) {
                    console.error(`Access Denied: Role '${role}' not in allowed roles: ${allowedRoles}`);
                    return res.status(403).json({ message: "Access denied" });
                }

                req.user = {
                    id: payload.sub,
                    role: role as "tenant" | "manager",
                    email: payload.email,
                };
                console.log("User attached to request:", req.user);

                next();
            }
        );
    };
};
