# SQLite Helper

Analyse ça quand je deploye le bot voilà ce qu'il dit il faut arranger le code problème : 

npm error code 1

npm error path /opt/render/project/src/node_modules/better-sqlite3

npm error command failed

npm error command sh -c prebuild-install || node-gyp rebuild --release

npm error make: Entering directory '/opt/render/project/src/node_modules/better-sqlite3/build'

npm error   TOUCH 4292fa9a667d77b27488aa109b010a85bce8e4e7a1c7aa0370cea902395c3866.intermediate

npm error   ACTION deps_sqlite3_gyp_locate_sqlite3_target_copy_builtin_sqlite3 4292fa9a667d77b27488aa109b010a85bce8e4e7a1c7aa0370cea902395c3866.intermediate

npm error   TOUCH Release/obj.target/deps/locate_sqlite3.stamp

npm error   CC(target) Release/obj.target/sqlite3/gen/sqlite3/sqlite3.o

npm error rm -f Release/obj.target/deps/sqlite3.a Release/obj.target/deps/sqlite3.a.ar-file-list; mkdir -p `dirname Release/obj.target/deps/sqlite3.a`

npm error ar crs Release/obj.target/deps/sqlite3.a @Release/obj.target/deps/sqlite3.a.ar-file-list

npm error   COPY Release/sqlite3.a

npm error   CXX(target) Release/obj.target/better_sqlite3/src/better_sqlite3.o

npm error rm 4292fa9a667d77b27488aa109b010a85bce8e4e7a1c7aa0370cea902395c3866.intermediate

npm error make: Leaving directory '/opt/render/project/src/node_modules/better-sqlite3/build'

npm error prebuild-install warn install No prebuilt binaries found (target=26.6.0 runtime=node arch=x64 libc= platform=linux)

npm error In file included from ../src/better_sqlite3.cpp:21:

npm error ../src/addon.cpp: In static member function ‘static void Addon::JS_setErrorConstructor(const v8::FunctionCallbackInfo<v8::Value>&)’:

npm error ../src/util/macros.cpp:17:76: warning: ‘void* v8::External::Value() const’ is deprecated: Use the version with the type tag. [-Wdeprecated-declarations]

npm error    17 | #define OnlyAddon static_cast<Addon*>(info.Data().As<v8::External>()->Value())

npm error       |                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^~

npm error ../src/addon.cpp:36:17: note: in expansion of macro ‘OnlyAddon’

npm error    36 |                 OnlyAddon->SqliteError.Reset(OnlyIsolate, SqliteError);

npm error       |                 ^~~~~~~~~

npm error In file included from /opt/render/.cache/26.6.0/include/node/v8.h:32,

npm error                  from /opt/render/.cache/26.6.0/include/node/node.h:74,

npm error                  from ../src/better_sqlite3.cpp:11:

npm error /opt/render/.cache/26.6.0/include/node/v8-external.h:55:9: note: declared here

npm error    55 |   void* Value() const { return Value(kExternalPointerTypeTagDefault); }

npm error       |         ^~~~~

npm error ../src/objects/backup.cpp: In static member function ‘static void Backup::JS_new(const v8::FunctionCallbackInfo<v8::Value>&)’:

npm error ../src/util/macros.cpp:17:76: warning: ‘void* v8::External::Value() const’ is deprecated: Use the version with the type tag. [-Wdeprecated-declarations]

npm error    17 | #define OnlyAddon static_cast<Addon*>(info.Data().As<v8::External>()->Value())

npm error       |                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^~

npm error ../src/util/macros.cpp:20:33: note: in expansion of macro ‘OnlyAddon’

npm error    20 | #define UseAddon Addon* addon = OnlyAddon

npm error       |                                 ^~~~~~~~~

npm error ../src/objects/backup.cpp:46:9: note: in expansion of macro ‘UseAddon’

npm error    46 |         UseAddon;

npm error       |         ^~~~~~~~

npm error /opt/render/.cache/26.6.0/include/node/v8-external.h:55:9: note: declared here

npm error    55 |   void* Value() const { return Value(kExternalPointerTypeTagDefault); }

npm error       |         ^~~~~

npm error ../src/objects/statement.cpp: In static member function ‘static void Statement::JS_new(const v8::FunctionCallbackInfo<v8::Value>&)’:

npm error ../src/util/macros.cpp:17:76: warning: ‘void* v8::External::Value() const’ is deprecated: Use the version with the type tag. [-Wdeprecated-declarations]

npm error    17 | #define OnlyAddon static_cast<Addon*>(info.Data().As<v8::External>()->Value())

npm error       |                                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^~

npm error ../src/util/macros.cpp:20:33: note: in expansion of macro ‘OnlyAddon

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fd6a5535-ffef-4f34-80b2-9bc7ea0d3c30).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
