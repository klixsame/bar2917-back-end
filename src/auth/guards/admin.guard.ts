
// @Injectable()
// export class OnlyAdminGuard implements CanActivate {
//     canActivate(context: ExecutionContext): boolean {
//         const request = context.switchToHttp().getRequest<{ user: User }>()
//         const user = request.user

//         if(!user.isAdmin) throw new ForbiddenException('You dont have rights')

//         return user.isAdmin
//     }
// }