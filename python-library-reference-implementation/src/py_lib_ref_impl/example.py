"""Example module demonstrating library structure."""


def add(a: int, b: int) -> int:
    """Add two integers together.

    Args:
        a: First integer.
        b: Second integer.

    Returns:
        The sum of a and b.

    Example:
        >>> add(2, 3)
        5
    """
    return a + b


def greet(name: str) -> str:
    """Generate a greeting message.

    Args:
        name: The name to greet.

    Returns:
        A greeting string.

    Example:
        >>> greet("World")
        'Hello, World!'
    """
    return f"Hello, {name}!"
