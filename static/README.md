# favicons
The default Yuebing favicons were generated using https://realfavicongenerator.net/ which generates
a variety of icons such that the app will have a good-looking icon in whatever computing environment
is rendering our experience.

## Custom favicons
To use your own favicons, you have some choices:

1. **Simple overwrite**<br/>
   Use the above-named service to generate your own icons, then overwrite 
   the files here with yours. If you one-for-one replace the files, everything
   will work identically<br/><br/>
2. **Set the `YB_FAVICON_DIR` environment variable**<br/>
   Use the above-named service to generate your own icons, then write them to
   some subdirectory under `static`, for example `static/my-icons`.
   Set the environment variable `YB_FAVICON_DIR=my-icons`when you run the app,
   and your favicons will be served<br/><br/>
3. **Full control**<br/>
   Edit nuxt.config.js, change the `head` block to deliver whatever favicons you want.<br/><br/>
