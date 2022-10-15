# dataset-gui

GUI to visuallize and manage the scraper interactively.

Wanted images are the validated images used for training.
Pending images are the images waiting to be treated for training.
Unwanted images are the undesired images.
Wanted tags are the ones used in queries for scraping.
Unwanted tags are used to filter the photos.
Unwanted users is for skipping some users that have unrelevant content and confusing tags.

![image_page](/images/page.png)

Drawing mode can add bounding boxes for manual labeling.

![draw](/images/draw.png)

Croping mode can crop in square shape the photo and keep the bounding boxes within the new dimensions.

![image_page](/images/crop.png)

## install

NodeJS:

https://github.com/nodesource/distributions/blob/master/README.md

packages:

    npm i

## run

    npm run dev

## lint

    npm run lint

## Docker

    sudo docker build -t dataset-gui-img .
    sudo docker run -it -p 3000:3000 --rm --name dataset-gui-run dataset-gui-img
## .env

Declare the type of each env variable inside types/environment.d.ts

    NEXT_PUBLIC_API_URL=http://localhost:8080
    NEXTAUTH_URL=http://localhost:3000
    ZITADEL_ISSUER=[yourIssuerUrl]
    ZITADEL_CLIENT_ID=[yourClientId]

## next-auth

Add this to the pages where you need authentification

```typescript
    const { data: session } = useSession()
    return (
        <>
            {
                session
                    ? <childComponent />
                    : <Layout>Access Denied</Layout>
            }
        </>
    );
```

## AWS Bash scripts

    find scripts/ -type f -exec chmod +x {} \;    

    ./scripts/<script-file>

npm install --save-dev jest jest-environment-jsdom @types/jest ts-jest @testing-library/react @testing-library/jest-dom

