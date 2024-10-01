export const IsTeacher = (userid: string) => {
  return userid === process.env.ADMIN_SECRET;
};
