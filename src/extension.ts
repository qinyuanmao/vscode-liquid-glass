import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { generateCSS } from './cssGenerator';

const CSS_FILE_NAME = 'liquid-glass-custom.css';

let isApplyingChanges = false;

export function activate(context: vscode.ExtensionContext) {
    console.log('Liquid Glass extension is now active');

    // Enable command
    let enableCommand = vscode.commands.registerCommand('vscode-liquid-glass.enable', async () => {
        await enableLiquidGlass(context);
    });

    // Disable command
    let disableCommand = vscode.commands.registerCommand('vscode-liquid-glass.disable', async () => {
        await disableLiquidGlass(context);
    });

    // Select wallpaper command
    let selectWallpaperCommand = vscode.commands.registerCommand('vscode-liquid-glass.selectWallpaper', async () => {
        await selectWallpaper(context);
    });

    // Configure transparency command
    let configureCommand = vscode.commands.registerCommand('vscode-liquid-glass.configure', async () => {
        await configureTransparency();
    });

    context.subscriptions.push(enableCommand, disableCommand, selectWallpaperCommand, configureCommand);

    // Auto-enable if enabled in settings (only on first activation)
    const config = vscode.workspace.getConfiguration('liquidGlass');
    if (config.get('enabled')) {
        enableLiquidGlass(context, true);
    }

    // Watch for configuration changes (only wallpaperPath and opacity changes)
    vscode.workspace.onDidChangeConfiguration(e => {
        if (isApplyingChanges) {
            return; // Skip if we're applying changes ourselves
        }

        // Only regenerate CSS if wallpaper or opacity changed, not on enable/disable
        if (e.affectsConfiguration('liquidGlass.wallpaperPath') ||
            e.affectsConfiguration('liquidGlass.editorOpacity') ||
            e.affectsConfiguration('liquidGlass.sidebarOpacity') ||
            e.affectsConfiguration('liquidGlass.quickInputOpacity')) {
            const config = vscode.workspace.getConfiguration('liquidGlass');
            if (config.get('enabled')) {
                enableLiquidGlass(context, true);
            }
        }
    });
}

async function enableLiquidGlass(context: vscode.ExtensionContext, silent: boolean = false) {
    try {
        isApplyingChanges = true;
        const config = vscode.workspace.getConfiguration('liquidGlass');
        const wallpaperPath = config.get<string>('wallpaperPath', '');

        if (!wallpaperPath && !silent) {
            const result = await vscode.window.showInformationMessage(
                'No wallpaper selected. Would you like to select one now?',
                'Select Wallpaper',
                'Skip'
            );
            if (result === 'Select Wallpaper') {
                await selectWallpaper(context);
                return;
            }
        }

        // Generate CSS with current settings
        const cssContent = generateCSS(config);

        // Save CSS file to extension storage
        const cssPath = path.join(context.globalStorageUri.fsPath, CSS_FILE_NAME);
        await fs.promises.mkdir(context.globalStorageUri.fsPath, { recursive: true });
        await fs.promises.writeFile(cssPath, cssContent, 'utf-8');

        // Update VSCode settings to use custom CSS
        // Only show Custom CSS prompt when user explicitly enables (not silent)
        await updateVSCodeSettings(cssPath, true, !silent);

        // Update enabled status
        await config.update('enabled', true, vscode.ConfigurationTarget.Global);

        // Automatically reload Custom CSS and JS
        try {
            await vscode.commands.executeCommand('extension.reloadCustomCSS');
        } catch (error) {
            console.log('Could not reload Custom CSS automatically:', error);
        }

        // Only show message if not silent (i.e., user explicitly enabled it)
        if (!silent) {
            vscode.window.showInformationMessage(
                'Liquid Glass enabled! Please reload VSCode for changes to take effect.',
                'Reload Now'
            ).then(selection => {
                if (selection === 'Reload Now') {
                    vscode.commands.executeCommand('workbench.action.reloadWindow');
                }
            });
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to enable Liquid Glass: ${error}`);
    } finally {
        isApplyingChanges = false;
    }
}

async function disableLiquidGlass(context: vscode.ExtensionContext) {
    try {
        const config = vscode.workspace.getConfiguration('liquidGlass');
        await config.update('enabled', false, vscode.ConfigurationTarget.Global);

        // Remove custom CSS from settings
        await updateVSCodeSettings('', false);

        // Automatically reload Custom CSS and JS
        try {
            await vscode.commands.executeCommand('extension.reloadCustomCSS');
        } catch (error) {
            console.log('Could not reload Custom CSS automatically:', error);
        }

        vscode.window.showInformationMessage(
            'Liquid Glass disabled! Please reload VSCode for changes to take effect.',
            'Reload Now'
        ).then(selection => {
            if (selection === 'Reload Now') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to disable Liquid Glass: ${error}`);
    }
}

async function selectWallpaper(context: vscode.ExtensionContext) {
    const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Select Wallpaper',
        filters: {
            'Images': ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp']
        }
    };

    const fileUri = await vscode.window.showOpenDialog(options);
    if (fileUri && fileUri[0]) {
        const wallpaperPath = fileUri[0].fsPath;
        const config = vscode.workspace.getConfiguration('liquidGlass');
        await config.update('wallpaperPath', wallpaperPath, vscode.ConfigurationTarget.Global);

        // Re-enable to apply new wallpaper
        if (config.get('enabled')) {
            await enableLiquidGlass(context);
        } else {
            vscode.window.showInformationMessage(
                'Wallpaper selected! Would you like to enable Liquid Glass now?',
                'Enable'
            ).then(selection => {
                if (selection === 'Enable') {
                    enableLiquidGlass(context);
                }
            });
        }
    }
}

async function configureTransparency() {
    const config = vscode.workspace.getConfiguration('liquidGlass');

    const option = await vscode.window.showQuickPick([
        { label: 'Editor Opacity', description: `Current: ${config.get('editorOpacity')}`, key: 'editorOpacity' },
        { label: 'Sidebar Opacity', description: `Current: ${config.get('sidebarOpacity')}`, key: 'sidebarOpacity' },
        { label: 'Quick Input Opacity', description: `Current: ${config.get('quickInputOpacity')}`, key: 'quickInputOpacity' }
    ], { placeHolder: 'Select which opacity to configure' });

    if (option) {
        const value = await vscode.window.showInputBox({
            prompt: `Enter opacity value (0-1)`,
            value: config.get(option.key)?.toString(),
            validateInput: (text) => {
                const num = parseFloat(text);
                if (isNaN(num) || num < 0 || num > 1) {
                    return 'Please enter a number between 0 and 1';
                }
                return null;
            }
        });

        if (value !== undefined) {
            await config.update(option.key, parseFloat(value), vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`${option.label} updated to ${value}`);
        }
    }
}

async function updateVSCodeSettings(cssPath: string, enable: boolean, showPrompt: boolean = false) {
    // Check if Custom CSS and JS Loader extension is installed
    const customCSSExtension = vscode.extensions.getExtension('be5invis.vscode-custom-css');
    if (!customCSSExtension) {
        const result = await vscode.window.showErrorMessage(
            'Custom CSS and JS Loader extension is not installed. This extension is required for Liquid Glass to work.',
            'Install Extension',
            'Cancel'
        );
        if (result === 'Install Extension') {
            vscode.env.openExternal(vscode.Uri.parse('vscode:extension/be5invis.vscode-custom-css'));
        }
        throw new Error('Custom CSS and JS Loader extension is required');
    }

    const config = vscode.workspace.getConfiguration();

    if (enable) {
        // Add custom CSS import
        const imports = config.get<string[]>('vscode_custom_css.imports', []);
        const cssUri = `file://${cssPath}`;

        if (!imports.includes(cssUri)) {
            imports.push(cssUri);
            await config.update('vscode_custom_css.imports', imports, vscode.ConfigurationTarget.Global);
        }

        // Only prompt user if explicitly requested (e.g., first time enabling)
        if (showPrompt) {
            const enableResult = await vscode.window.showInformationMessage(
                'To apply the Liquid Glass effect, you need to enable Custom CSS and JS. This will require administrator privileges.',
                'Enable Custom CSS',
                'Later'
            );
            if (enableResult === 'Enable Custom CSS') {
                await vscode.commands.executeCommand('extension.installCustomCSS');
            }
        }
    } else {
        // Remove custom CSS import
        const imports = config.get<string[]>('vscode_custom_css.imports', []);
        const filteredImports = imports.filter(i => !i.includes(CSS_FILE_NAME));
        await config.update('vscode_custom_css.imports', filteredImports, vscode.ConfigurationTarget.Global);
    }
}

export function deactivate() {}
