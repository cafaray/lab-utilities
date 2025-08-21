# Use LFS for some Unity Project file cases.

Unity often produces large assets (textures, audio, models). Regular Git isn’t great with those.
Enable Git LFS (Large File Storage) for manage these files.

## Install Git LFS

`brew install git-lfs`

Once installed, associate it with the git repository:

`git lfs install`

Result should look like:
```bash
Updated Git hooks.
Git LFS initialized.
```

## Track large files with Git LFS
git lfs track "*.psd"
git lfs track "*.png"
git lfs track "*.fbx"
git lfs track "*.wav"

> GitHub Free includes 1 GB storage and 1 GB/month bandwidth for Git LFS.
> Consider to purchase more or use an alternative (some teams use cloud storage alongside Git, but Git LFS is the standard).

## .gitattributes for Unity projects

A file for gitattributes should be created in root path repository to manage:

- Unity YAML (scenes, prefabs, animations, materials, etc.)

- Large assets tracked by Git LFS

- 3D models

- Audio

- Video

- Unity binary files (e.g., asset bundles)

- Fonts

- Misc (like .zip or .rar)

## Push to the origin

```bash
git add .gitattributes
git commit -m "Setup Git LFS for Unity assets"
git push origin
```

## Note.

This will not retroactively move existing large files into LFS.
If you already pushed big files, you’ll need to migrate them with:

```bash
git lfs migrate import --include="*.psd,*.fbx,*.png,*.wav"
git push --force
```
