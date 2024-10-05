const isAdmin = (req, res, next) => {
  const { role } = req.user;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Только для администратора.' });
  }

  next();  // Если роль admin, продолжаем выполнение запроса
};

export default isAdmin;
