import styles from "@styles/footer.module.css"
import { Image } from "@nextui-org/react";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <a
                href="https://zitadel.ch"
                target="_blank"
                rel="noopener noreferrer"
            >
                Powered by{' '}
                <span className={styles.logo}>
                    <Image src="@public/zitadel-logo-dark.svg" alt="Zitadel Logo" height={40} width={147.5} />
                </span>
            </a>
        </footer>
    )
}
