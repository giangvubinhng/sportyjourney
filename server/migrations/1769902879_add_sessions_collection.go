package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		// add up queries...
		jsonData := `[
			{
					"id": "pbc_1092069950",
					"listRule": "@request.auth.id = created_by.id",
					"viewRule": "@request.auth.id = created_by.id",
					"createRule": "@request.auth.id != \"\"",
					"updateRule": "@request.auth.id = created_by.id",
					"deleteRule": null,
					"name": "sessions",
					"type": "base",
					"fields": [
							{
									"autogeneratePattern": "[a-z0-9]{15}",
									"hidden": false,
									"id": "text3208210256",
									"max": 15,
									"min": 15,
									"name": "id",
									"pattern": "^[a-z0-9]+$",
									"presentable": false,
									"primaryKey": true,
									"required": true,
									"system": true,
									"type": "text"
							},
							{
									"autogeneratePattern": "",
									"hidden": false,
									"id": "text1579384326",
									"max": 0,
									"min": 0,
									"name": "name",
									"pattern": "",
									"presentable": false,
									"primaryKey": false,
									"required": true,
									"system": false,
									"type": "text"
							},
							{
									"hidden": false,
									"id": "number2254405824",
									"max": null,
									"min": null,
									"name": "duration",
									"onlyInt": true,
									"presentable": false,
									"required": true,
									"system": false,
									"type": "number"
							},
							{
									"hidden": false,
									"id": "number2534504849",
									"max": 10,
									"min": 0,
									"name": "energy",
									"onlyInt": true,
									"presentable": false,
									"required": true,
									"system": false,
									"type": "number"
							},
							{
									"convertURLs": false,
									"hidden": false,
									"id": "editor3485334036",
									"maxSize": 0,
									"name": "note",
									"presentable": false,
									"required": false,
									"system": false,
									"type": "editor"
							},
							{
									"cascadeDelete": false,
									"collectionId": "_pb_users_auth_",
									"hidden": false,
									"id": "relation2809058197",
									"maxSelect": 1,
									"minSelect": 0,
									"name": "created_by",
									"presentable": false,
									"required": true,
									"system": false,
									"type": "relation"
							},
							{
									"hidden": false,
									"id": "date2862495610",
									"max": "",
									"min": "",
									"name": "date",
									"presentable": false,
									"required": true,
									"system": false,
									"type": "date"
							},
							{
									"hidden": false,
									"id": "autodate2990389176",
									"name": "created_at",
									"onCreate": true,
									"onUpdate": false,
									"presentable": false,
									"system": false,
									"type": "autodate"
							},
							{
									"hidden": false,
									"id": "autodate3332085495",
									"name": "updated_at",
									"onCreate": true,
									"onUpdate": true,
									"presentable": false,
									"system": false,
									"type": "autodate"
							}
					],
					"indexes": [],
					"system": false
				}
		]`
		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		// add down queries...
		return nil
	})
}
