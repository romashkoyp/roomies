const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }),

    await queryInterface.createTable('notifications', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      }
    })

    await queryInterface.createTable('rooms', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      image_path: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      time_begin: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: '00:00:00'
      },
      time_end: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: '00:00:00'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      }
    })

    await queryInterface.createTable('bookings', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      time_begin: {
        type: DataTypes.TIME,
        allowNull: false
      },
      time_end: {
        type: DataTypes.TIME,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      }
    })

    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      }
    })

    await queryInterface.addColumn('notifications', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id', onDelete: 'CASCADE' },
    }),

    await queryInterface.addColumn('rooms', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id', onDelete: 'CASCADE' },
    }),

    await queryInterface.addColumn('bookings', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id', onDelete: 'CASCADE' }
    }),

    await queryInterface.addColumn('bookings', 'room_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'rooms', key: 'id', onDelete: 'CASCADE' }
    })

    await queryInterface.addColumn('sessions', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id', onDelete: 'CASCADE' }
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('notifications', 'notifications_user_id_fkey')
    await queryInterface.dropTable('notifications')

    await queryInterface.removeConstraint('sessions', 'sessions_user_id_fkey')
    await queryInterface.dropTable('sessions')
    
    await queryInterface.removeConstraint('bookings', 'bookings_user_id_fkey', 'bookings_room_id_fkey')
    await queryInterface.dropTable('bookings')

    await queryInterface.removeConstraint('rooms', 'rooms_user_id_fkey')
    await queryInterface.dropTable('rooms')

    await queryInterface.dropTable('users')
  }
}