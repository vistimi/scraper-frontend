import { Navbar, Button, Link, Text, useTheme } from "@nextui-org/react";


export const NavBar = (): JSX.Element => {
    const { isDark } = useTheme();

    return (
            <Navbar isBordered={isDark} variant={"static"}>
                <Navbar.Brand>
                    <Text b color="inherit" hideIn="xs">
                        VISTIMI
                    </Text>
                </Navbar.Brand>
                <Navbar.Content hideIn="xs">
                    <Navbar.Link href="/imagesPending">imagesPending</Navbar.Link>
                    <Navbar.Link href="/imagesUnwanted">imagesUnwanted</Navbar.Link>
                    <Navbar.Link href="/imagesWanted">imagesWanted</Navbar.Link>
                    <Navbar.Link href="/tags">tags</Navbar.Link>
                    <Navbar.Link href="/users">users</Navbar.Link>
                </Navbar.Content>
            </Navbar>
    );
}

