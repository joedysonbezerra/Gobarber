import Sequelize, { Model } from 'sequelize';
import bycrpt from 'bcryptjs';

class User extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize: connection,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bycrpt.hash(user.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    // belongsTo -> ID de File como chave estrangeira no User
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bycrpt.compare(password, this.password_hash);
  }
}

export default User;
