import jwt from 'jsonwebtoken';
import {db} from './db.js';
const secret=()=>process.env.JWT_SECRET||'development-secret-change-me';
export const issue=user=>jwt.sign({id:user.id,role:user.role,name:user.name},secret(),{expiresIn:'8h'});
export const authenticate=(req,res,next)=>{const token=req.headers.authorization?.split(' ')[1];try{const tokenUser=jwt.verify(token,secret()),user=db.prepare('SELECT id,name,role,isActive FROM users WHERE id=?').get(tokenUser.id);if(!user||!user.isActive)return res.status(401).json({error:'Active authentication required'});req.user=user;next()}catch{return res.status(401).json({error:'Authentication required'})}};
export const allow=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({error:'Insufficient role'})
