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
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
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

    await queryInterface.createTable('global_weekdays',{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
          min: 0,
          max: 6,
          isIn: {
            args: [[0, 1, 2, 3, 4, 5, 6]],
            msg: 'Invalid day of the week. Please enter a number between 0 and 6'
          }
        }
      },
      availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      time_begin: {
        type: DataTypes.TIME,
        allowNull: true
      },
      time_end: {
        type: DataTypes.TIME,
        allowNull: true
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

    await queryInterface.createTable('individual_dates',{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      availability: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      time_begin: {
        type: DataTypes.TIME,
        allowNull: true
      },
      time_end: {
        type: DataTypes.TIME,
        allowNull: true
      },
      day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 6,
          isIn: {
            args: [[0, 1, 2, 3, 4, 5, 6]],
            msg: 'Invalid day of the week. Please enter a number between 0 and 6'
          }
        }
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

    await queryInterface.createTable('global_dates',{
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      time_begin: {
        type: DataTypes.TIME,
        allowNull: true
      },
      time_end: {
        type: DataTypes.TIME,
        allowNull: true
      },
      day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 6,
          isIn: {
            args: [[0, 1, 2, 3, 4, 5, 6]],
            msg: 'Invalid day of the week. Please enter a number between 0 and 6'
          }
        }
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

    await queryInterface.addColumn('individual_dates', 'room_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'rooms', key: 'id', onDelete: 'CASCADE' }
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('notifications', 'notifications_user_id_fkey')
    await queryInterface.dropTable('notifications')

    await queryInterface.removeConstraint('sessions', 'sessions_user_id_fkey')
    await queryInterface.dropTable('sessions')

    await queryInterface.removeConstraint('bookings', 'bookings_user_id_fkey')
    await queryInterface.removeConstraint('bookings', 'bookings_room_id_fkey')
    await queryInterface.dropTable('bookings')

    await queryInterface.removeConstraint('individual_dates', 'individual_dates_room_id_fkey')
    await queryInterface.dropTable('individual_dates')

    await queryInterface.removeConstraint('rooms', 'rooms_user_id_fkey')
    await queryInterface.dropTable('rooms')

    await queryInterface.dropTable('global_weekdays')
    await queryInterface.dropTable('global_dates')

    await queryInterface.dropTable('users')
  }
}