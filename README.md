# IP Addressing and Subnetting Calculator

## Project introduction

This is a browser-based learning tool for the IPv4, IP addressing and IPv6 topics in Unit III of the BH23 CSE (AI&ML) Computer Networks syllabus. It validates addresses and explains the results of subnet and CIDR calculations without a server or database.

## Problem statement

Students often need to perform IP subnet calculations by hand and check address formats across several rules. This project provides an interactive way to validate addresses, calculate subnet details, and review core IP addressing concepts.

## Objectives

- Validate IPv4 dotted-decimal addresses and IPv6 full or compressed addresses.
- Calculate IPv4 subnet masks, network and broadcast addresses, host ranges, address counts and wildcard masks.
- Accept both separate IP/prefix input and CIDR notation.
- Explain common IPv4 ranges and IPv4/IPv6 differences in a simple reference section.

## Technologies used

- HTML5 for page structure
- CSS3 for responsive layout and styling
- Vanilla JavaScript for validation and calculations

No framework, backend, database or package installation is required. The page loads a Google Fonts stylesheet when internet access is available; it falls back to system fonts when offline.

## Features

- IPv4 validation with actionable errors for wrong octet count, non-decimal octets and values above 255.
- Subnet calculator for every prefix from `/0` through `/32`.
- CIDR calculator such as `192.168.1.10/24`.
- IPv6 validation including `::` compression and IPv4-mapped style address syntax.
- Quick reference for private ranges, legacy classes, loopback, network and broadcast concepts.
- Responsive navigation, result cards and reset controls.
- `/31` treats both addresses as usable point-to-point endpoints; `/32` is treated as a single-address host route.

## Project structure

```text
IP-Addressing-Calculator/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How to run

1. Keep `index.html`, `style.css` and `script.js` in the same folder.
2. Open `index.html` in a modern browser (double-click it or choose Open With).
3. Select a calculator from the navigation, enter an address and calculate.

There is no build step or local server requirement.

## Sample inputs and outputs

### Subnet example

Input: IP `192.168.1.10`, prefix `24` (or CIDR `192.168.1.10/24`)

| Result | Value |
|---|---|
| Subnet mask | `255.255.255.0` |
| Network address | `192.168.1.0` |
| Broadcast address | `192.168.1.255` |
| First / last usable host | `192.168.1.1` / `192.168.1.254` |
| Total / usable hosts | `256` / `254` |
| Wildcard mask | `0.0.0.255` |

### Special prefixes

- `10.0.0.1/31`: two total addresses; both are shown as usable endpoints for a point-to-point link.
- `10.0.0.1/32`: one address; the single IP is shown as the host route and conventional host-range rules do not apply.
- `192.168.1.1/30`: network `192.168.1.0`, broadcast `192.168.1.3`, usable range `.1`–`.2`.

### Validation examples

- Valid IPv4: `8.8.8.8`
- Invalid IPv4: `192.168.1.256` (an octet is above 255)
- Valid IPv6: `2001:db8::1`
- Invalid IPv6: `2001:::1` (more than one compression marker / malformed groups)

## Algorithms used

1. **IPv4 validation:** split on dots; require exactly four decimal-only parts; parse each and check the inclusive range 0–255.
2. **IPv4 integer conversion:** combine octets in base 256 to make an unsigned 32-bit value. Convert back by taking each base-256 digit.
3. **Subnet boundaries:** for prefix `p`, the block size is `2^(32-p)`. The network is the start of the block containing the IP; the broadcast is the last value in that block. The mask has `p` leading one bits and the wildcard is its bitwise complement.
4. **Host counts:** for `/0`–`/30`, total addresses are block size and conventional usable hosts are total minus two. A `/31` has two usable point-to-point endpoints. A `/32` has one address and no conventional network/broadcast host range.
5. **IPv6 validation:** reject malformed compression; check each hexadecimal group has one to four digits; require exactly eight 16-bit groups without `::`, or fewer than eight explicit groups with `::`. An embedded IPv4 tail counts as two groups.

## Module descriptions

- **IPv4 Validator:** checks the dotted-decimal structure and octet limits.
- **Subnet Mask Calculator:** takes an IPv4 address and a separate prefix and displays subnet results.
- **CIDR Calculator:** parses `address/prefix` and reuses the same subnet calculation.
- **IPv6 Validator:** checks full/compressed hexadecimal notation, with optional IPv4 tail.
- **IP Information:** presents private IPv4 ranges, legacy classes and key address concepts.

## Testing results

The following representative cases were checked against the calculation rules:

| Test | Input | Expected result |
|---|---|---|
| IPv4 valid | `192.168.1.10` | Valid |
| IPv4 wrong range | `192.168.1.256` | Invalid; octet range error |
| IPv4 wrong count | `192.168.1` | Invalid; four octets required |
| Subnet /8 | `10.20.30.40/8` | Mask `255.0.0.0`, network `10.0.0.0`, broadcast `10.255.255.255` |
| Subnet /16 | `172.16.5.9/16` | Mask `255.255.0.0`, network `172.16.0.0`, broadcast `172.16.255.255` |
| Subnet /24 | `192.168.1.10/24` | Mask `255.255.255.0`, network `.0`, broadcast `.255` |
| Subnet /30 | `192.168.1.1/30` | Network `.0`, broadcast `.3`, usable `.1`–`.2` |
| Subnet /31 | `10.0.0.1/31` | Two addresses, both usable endpoint addresses |
| Subnet /32 | `10.0.0.1/32` | One address; conventional host rules do not apply |
| IPv6 valid compressed | `2001:db8::1` | Valid |
| IPv6 invalid | `2001:::1` | Invalid |

These are documented test cases and calculation expectations. To demonstrate interactively, enter each case in the matching section of the page.

## Screenshots to capture

For a project report or presentation, capture:

1. The welcome section and navigation at desktop width.
2. IPv4 validation for one valid and one invalid address.
3. `/24` subnet results showing all result cards.
4. `/31` and `/32` results with their explanatory notes.
5. A valid compressed IPv6 result and an invalid IPv6 result.
6. The IP information reference cards and a mobile-width view.

## Academic presentation

### Abstract

The IP Addressing and Subnetting Calculator is a small web application designed to support learning of IPv4 and IPv6 concepts. It checks address formats, calculates subnet details from CIDR prefixes, and provides quick reference information about address ranges. The project uses HTML, CSS and JavaScript only, so it runs locally in a web browser without a backend.

### Existing system

Subnetting is often practised with manual binary conversion, formula sheets or separate online tools. Manual work can take time and mistakes in prefix or boundary calculations can be difficult to spot. Online tools may also provide results without explaining the underlying concepts.

### Proposed system

The proposed application puts common validation and subnet calculations into one responsive page. It shares one calculation function between the separate-prefix and CIDR forms, gives clear input errors, and explains the special handling for `/31` and `/32` prefixes.

### System requirements

- **Hardware:** any computer or mobile device able to run a modern web browser.
- **Software:** a modern browser such as Chrome, Edge, Firefox or Safari.
- **Development:** a text editor for HTML, CSS and JavaScript files.
- **Network:** not needed for calculations; optional internet access loads the selected web font.

### Architecture / workflow

```text
User input
    ↓
HTML form and JavaScript event handler
    ↓
Input validation (IPv4 / CIDR / IPv6)
    ↓
Subnet calculation (for IPv4 subnet and CIDR forms)
    ↓
Formatted result cards or a clear error message
```

### Screenshots to capture

Use the six screenshot suggestions above as the report's implementation evidence. Capture the actual browser output after entering each sample input.

### Conclusion

This project provides a simple way to practise IP validation, IPv4 subnetting, CIDR notation and IPv6 formats. Its calculations run in the browser and its results are organized for quick checking and classroom demonstration.

### Future scope

- Show binary forms of addresses and masks to illustrate subnet boundaries.
- Add subnet range splitting and VLSM practice.
- Add an IPv6 prefix and address-expansion view.
- Add downloadable calculation results or printable worksheets.

### Viva questions and simple answers

1. **What is an IP address?** A logical address used to identify a device or interface on an IP network.
2. **How many bits are in IPv4?** 32 bits, usually shown as four decimal octets.
3. **How many bits are in IPv6?** 128 bits, usually shown as hexadecimal groups.
4. **What does `/24` mean?** The first 24 bits are the network prefix; the remaining 8 bits identify addresses within the subnet.
5. **What is a subnet mask?** A 32-bit value that marks network bits with 1 and host bits with 0.
6. **What is a network address?** The first address of an IPv4 subnet, with all host bits set to 0.
7. **What is a broadcast address?** The last address of a conventional IPv4 subnet, used to reach all hosts in that subnet.
8. **What is a wildcard mask?** The inverse of the subnet mask, often used in access-control and routing configuration.
9. **Why are `/31` and `/32` special?** `/31` can use both addresses on a point-to-point link; `/32` identifies one address and has no conventional host range.
10. **What is CIDR?** Classless Inter-Domain Routing; it represents a network prefix with a slash and prefix length.
11. **What is a private IPv4 address?** An address from a reserved local-use range that is not routed directly on the public internet.
12. **What does `::` mean in IPv6?** It replaces one or more consecutive zero groups, and can appear at most once in an address.
13. **What is loopback?** An address used by a device to communicate with itself; `127.0.0.1` is the common IPv4 example.
14. **Does this project need a server?** No. The HTML, CSS and JavaScript run directly in a browser.
