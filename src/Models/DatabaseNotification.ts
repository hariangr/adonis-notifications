import { DateTime } from 'luxon'

const { column, BaseModel } = global[Symbol.for('ioc.use')]('Adonis/Lucid/Orm')

import { DatabaseNotificationModel, DatabaseNotificationRow } from '@ioc:Verful/Notification'
import StaticImplements from '../Helpers/StaticImplements'
import type { LucidModel } from '@ioc:Adonis/Lucid/Orm'

export default function createNotificationModel(tableName: string): DatabaseNotificationModel {
  @StaticImplements<DatabaseNotificationModel>()
  class DatabaseNotification extends (BaseModel as LucidModel) implements DatabaseNotificationRow {
    public static table = tableName

    @column({ isPrimary: true })
    public id: number

    @column({
      prepare: (value) => JSON.stringify(value),
      consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
    })
    public data: Record<string, any>

    @column()
    public notifiableId: number

    public async markAsRead(this: DatabaseNotificationRow) {
      await this.merge({ readAt: DateTime.now() }).save()
    }

    public async markAsUnread(this: DatabaseNotificationRow) {
      await this.merge({ readAt: null }).save()
    }

    public get read() {
      return Boolean(this.readAt)
    }

    public get unread() {
      return !this.readAt
    }

    @column.dateTime({ autoCreate: false, autoUpdate: false })
    public readAt: DateTime | null

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
  }

  return DatabaseNotification
}
