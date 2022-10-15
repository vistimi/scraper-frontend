import { Navbar, Button, Link, Text, useTheme } from "@nextui-org/react";


export const NavBar = (): JSX.Element => {
    const { isDark } = useTheme();

    return (
            <>
            <Navbar isBordered={isDark} variant={"static"}>
                <Navbar.Brand>
                    <Text b color="inherit" hideIn="xs">
                        VISTIMI
                    </Text>
                </Navbar.Brand>
                <Navbar.Content hideIn="xs">
                    <Navbar.Link href="/images/pending">pending</Navbar.Link>
                    <Navbar.Link href="/images/validation">validation</Navbar.Link>
                    <Navbar.Link href="/images/production">production</Navbar.Link>
                    <Navbar.Link href="/images/undesired">undesired</Navbar.Link>
                    <Navbar.Link href="/tags/tags">tags</Navbar.Link>
                    <Navbar.Link href="/users/users">users</Navbar.Link>
                </Navbar.Content>
            </Navbar>
            <br /></>
    );
}

