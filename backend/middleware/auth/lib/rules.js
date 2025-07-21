export const rules = {
  /**
   * 🔐 Must be an admin
   */
  admin: (decoded) =>
    !decoded?.isAdmin
      ? { status: 403, message: "Admin access only" }
      : null,

  /**
   * 🛡️ Must be a superadmin
   */
  superadmin: (decoded) =>
    decoded?.role !== "superadmin"
      ? { status: 403, message: "SuperAdmin access only" }
      : null,

  /**
   * 🔍 Token must contain a valid userId
   */
  userExists: (decoded) =>
    !decoded?.userId
      ? { status: 403, message: "User ID missing in token" }
      : null,

  /**
   * 🔄 User must match the param ID or be admin
   */
  userMatch: (decoded, req) =>
    decoded?.userId?.toString() !== req.params?.id?.toString() &&
    !decoded?.isAdmin
      ? { status: 403, message: "Access denied: not owner or admin" }
      : null,

  /**
   * 🧍‍♂️ Must be acting only on self
   */
  selfOnly: (decoded, req) =>
    decoded?.userId?.toString() !== req.params?.id?.toString()
      ? { status: 403, message: "This action is only allowed on your own account" }
      : null,

  /**
   * ❌ Prevent actions on self (e.g. banning yourself)
   */
  notSelf: (decoded, req) =>
    decoded?.userId?.toString() === req.params?.id?.toString()
      ? { status: 403, message: "You cannot perform this action on yourself" }
      : null,

  /**
   * 🎯 Accepts array of roles that are allowed
   * Usage: [rules.roleIn(["admin", "vendor"])]
   */
  roleIn: (roles) => (decoded) =>
    !roles.includes(decoded?.role)
      ? {
          status: 403,
          message: `Requires one of roles: ${roles.join(", ")}`,
        }
      : null,
};
