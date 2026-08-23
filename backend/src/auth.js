import jwt from 'jsonwebtoken';
const secret=()=>process.env.JWT_SECRET||'development-secret-change-me';
export const issue=user=>jwt.sign({id:user.id,role:user.role,name:user.name},secret(),{expiresIn:'8h'});
export const authenticate=(req,res,next)=>{const token=req.headers.authorization?.split(' ')[1];try{req.user=jwt.verify(token,secret());next()}catch{return res.status(401).json({error:'Authentication required'})}};
export const allow=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({error:'Insufficient role'})
