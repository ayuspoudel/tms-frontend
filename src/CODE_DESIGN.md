src
 ├── api
 │   ├── auth.api.js
 │   ├── job.api.js       # NEW
 │   ├── run.api.js       # NEW
 │   ├── logs.api.js      # NEW
 │   ├── scheduler.api.js # NEW
 │   └── ...
 ├── components
 │   ├── BrandHeader.vue
 │   └── NavBar.vue
 ├── modules
 │   ├── auth
 │   ├── dashboard
 │   ├── jobs             # NEW
 │   │   └── pages
 │   │       ├── Jobs.vue
 │   │       └── JobDetails.vue
 │   ├── runs             # NEW
 │   │   └── pages
 │   │       ├── Runs.vue
 │   │       └── RunDetails.vue
 │   ├── scheduler        # NEW
 │   │   └── pages
 │   │       └── Scheduler.vue
 │   ├── logs             # NEW
 │   │   └── pages
 │   │       └── Logs.vue
 │   └── settings
 │       └── pages
 │           └── Settings.vue
 ├── store
 │   ├── auth.js
 │   ├── jobs.js          # NEW
 │   ├── runs.js          # NEW
 │   └── users.js
